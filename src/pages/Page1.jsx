import React, { useState, useEffect } from "react";
import { Slider } from "../components/Slider";
import Account from "../components/Account";
import WalletNFTList from "../components/WalletNFTList";
import { Carousel } from "react-bootstrap";
import initWeb3Onboard from "../service/initWeb3Onboard";
import { isMobile } from "react-device-detect";
import {
  init,
  useConnectWallet,
  useSetChain,
  useWallets,
} from "@web3-onboard/react";
import {
  getBlockchain,
  isValidNetwork,
  getContactProvider,
} from "../utils/ethereum";

import  {hashNetworkIds} from '../utils/Constant'

const Page1 = () => {
  const [{ wallet }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();
  const connectedWallets = useWallets();
  const [address, setAddress] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [web3Onboard, setWeb3Onboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState(null);
  const [networkMessage, setNetworkMessage] = useState(null);
  const validNetworkHash = process.env.REACT_APP_ENV === 'dev' ? '0x4':'0x1';
  const wrongNetworkMessage = `Wrong network, please switch to  ----- ${hashNetworkIds[validNetworkHash]} and refresh`;

  useEffect(() => {
    if (!connectedWallets.length) return;

    /*const initVal = async ()=>{
      console.log("wallet",wallet)
      const { valid, message } = await isValidNetwork(wallet);
      if (!valid) {
        setNetworkMessage(message)
      }
      setLoading(false)
    }
    initVal()*/

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    );
    window.localStorage.setItem(
      "connectedWallets",
      JSON.stringify(connectedWalletsLabelArray)
    );
  }, [connectedWallets]);

  useEffect(() => {
    setWeb3Onboard(initWeb3Onboard);
    //console.log("---wallet---", wallet);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const { contract, accounts = [] } = await getBlockchain(initWeb3Onboard);
        setAccounts(accounts[0]);
        setAddress(accounts[0])
        setContract(contract)
      } catch (e) {
        //setLoadingMessage(e);
      }
      if (typeof window.ethereum !== "undefined") {
        // Existing code goes here

        window?.ethereum?.on("accountsChanged", function (accounts) {
          console.log(`Selected account changed to ${accounts[0]}`);
          setAccounts(accounts[0]);
          setAddress(accounts[0]);
        });

        window?.ethereum?.on("chainChanged", () => {
          window.location.reload();
        });
        /*window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });*/
      }
    };
    init();
  }, []);

  useEffect(() => {
    const setWalletFromLocalStorage = async (previouslyConnectedWallets) => {
      let res = await connect({ autoSelect: previouslyConnectedWallets[0] });
      setTimeout(()=>{
        if(!accounts && !address && wallet?.accounts[0]?.address){
          setAccounts(wallet?.accounts[0]?.address)
          setAddress(wallet?.accounts[0]?.address)
        }
      },3000);
      //console.log("----res--", res);
    };
    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem("connectedWallets")
    );
    if (previouslyConnectedWallets?.length) {
      setWalletFromLocalStorage(previouslyConnectedWallets);
    }
  }, [web3Onboard, connect]);

  const handleConnect = async (account) => {
    //alert("called");
    let wallets = await connect();
    if (wallet && wallet?.accounts[0]) {
      setAccounts(wallet?.accounts[0]?.address);
    }
    /*const initVal = async ()=>{
      //console.log("connectedWallets",connectedWallets)
      const { valid, message } = await isValidNetwork(wallet);
      if (!valid) {
        setNetworkMessage(message)
      }
      setLoading(false)
    }
    setTimeout(()=>{initVal()},5000)*/
  };

  const handleDisconnect = async (wallet) => {
    try{
      //alert("wallet"+wallet)
    await disconnect(wallet);

    const connectedWalletsList = connectedWallets.map(({ label }) => label);
    setAccounts(null)
    setAddress(null)
    window.localStorage.setItem("connectedWallets", null);
    localStorage.clear();}
    catch (e){
      setAccounts(null)
      setAddress(null)
      window.localStorage.setItem("connectedWallets", null);
      localStorage.clear();
      //alert("error in alert"+e)
    }

  };

  return (
    <div className="section_first">
      <div className="container-fluid h-100">
        <div className="row">
          <div className="ps-0 pe-0 col-xl-12 left_blue_block">
            {/* <div className="top_green_line"></div> */}
            <div className="box_inner_content">
              <div className="logo_with_title">
                <img className="logo" src="./logo.png" alt="Logo" />
                <h2>NON-FUNGIBLE CONFERENCE</h2>
              </div>
              {!(wallet?.accounts[0]?.address || address) && <div className="wallet" onClick={handleConnect}>
                <img src="./wallet_2.png" alt="wallet" />
              </div>}
              {(wallet?.accounts[0]?.address || address ) && <div className="wallet" onClick={()=>{handleDisconnect(wallet)}}>
                <p>Disconnect</p>
              </div>}
            </div>
            <div className="connect_address">
              <p className="connect_text">
                {(wallet?.accounts[0]?.address || address) ? "Connected" : "Not Connected"}
              </p>
             {/* {wallet && wallet?.accounts[0]?.address}*/}
              <p className="address_text">{(wallet?.accounts[0]?.address || address) ?? "..."}</p>
            </div>
            <div className="bottom_fixed_bar">
              <h4 className="powered_by">POWERED BY</h4>
              <img
                className="powered_by_img"
                src="./powered_by.png"
                alt="Powered By Logo"
              />
            </div>
          </div>
          <div className="col-xl-12 ps-0 pe-0 right_slide_block">
            <Account address={wallet?.accounts[0]?.address} setAddress={setAddress} />
           {/* <p>{networkMessage}</p>
            <p> {address}{loading}</p>
            <p>wallet{wallet?.accounts[0]?.address}</p>
            <p>connectedChain{connectedChain?.id}</p>
           */} <p>{(wallet?.accounts[0]?.address || address) && connectedChain?.id !== validNetworkHash && wrongNetworkMessage}</p>
            {(wallet?.accounts[0]?.address || address)  && (connectedChain?.id === validNetworkHash ) && <WalletNFTList wallet={wallet} address={wallet?.accounts[0]?.address} contract={contract}></WalletNFTList>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page1;
