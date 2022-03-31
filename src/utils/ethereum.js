import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import Advisor from "../contracts/Advisor.json";
import { networks,addresses } from "./Constant";
import { isMobile } from "react-device-detect";

const isValidNetwork = async (wallet) => {
  //const conProvider = await connectedWallets[0]?.provider;
  //alert("wallet"+wallet)

  const provider = !isMobile ? await detectEthereumProvider() : (wallet?.provider  || null ) ;
  const trgNet = process.env.REACT_APP_ENV === "dev" ? 4 : 1
  const targetNetwork = networks[trgNet];
  const message = `Wrong network, please switch to  ----- ${targetNetwork} and refresh`;
  const { ethereum } = window;
 // alert(wallet);
  if (!ethereum && !isMobile) {
    alert("Please install Metamask!");
  }
  if (provider) {
    const networkId = await provider.request({ method: "net_version" });
    //alert("networkId"+networkId)
    if (networkId.toString() === trgNet.toString()) {
      return { valid: true };
    } else {
      return { valid: false, message: message };
    }
  } else {
    //alert("else")
    return { valid: false, message: message };
  }
};
const getBlockchain = (onboard) =>
  new Promise(async (resolve, reject) => {
    // console.log("----process.env----",process.env);
    const provider = await detectEthereumProvider();
   // alert("provider first")
    if (provider) {
     // alert("provider")
      const networkId = await provider.request({ method: "net_version" });
      const trgNet = process.env.REACT_APP_ENV === "dev" ? 4 : 1
      console.log("networkId",networkId)
      /*if(networkId.toString() !== trgNet.toString()) {
        const targetNetwork = networks[trgNet];
        alert(`Wrong network, please switch to  ----- ${targetNetwork}`);
        return;
      }*/
      //console.log("onboard", onboard);
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      //alert("accounts"+ accounts)
      const web3 = new Web3(provider);
      try {
        const contract = new web3.eth.Contract(Advisor, addresses[process.env.REACT_APP_ENV === "dev" ? 4 : 1].Advisor);
        console.log("--airdrop, accounts: accounts ",contract, accounts )
        resolve({ contract, accounts: accounts });
        return;
      } catch (e) {
        reject("error:"+ e);
      }
    }
    resolve({ contract:null, accounts:null });
  });

const disconnect = async () => {
  const {ethereum} = window
  const res = await ethereum.request({
    method: "eth_requestAccounts",
    params: [{ eth_accounts: {} }],
  });
  //console.log("res", res);
  return { success: false };
};

const getContactProvider = async (wallet) => {
  //alert("getContactProvider wallet"+ wallet)
  //const networkId = await wallet?.provider?.request({ method: "net_version" });
  //alert("getContactProvider networkId")
  const web3 = new Web3(wallet.provider);
  //alert("getContactProvider web3"+ web3)
  const airdrop = new web3.eth.Contract(Advisor, addresses[process.env.REACT_APP_ENV === "dev" ? 4 : 1].Advisor);
  //alert("getContactProvider airdrop"+ airdrop)
  return airdrop;
};

export { getBlockchain, disconnect, isValidNetwork, getContactProvider };
