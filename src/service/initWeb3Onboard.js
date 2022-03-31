import { init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import ledgerModule from "@web3-onboard/ledger";
import walletConnectModule from "@web3-onboard/walletconnect";
import walletLinkModule from "@web3-onboard/walletlink";

const injected = injectedModule();
const walletLink = walletLinkModule();
const walletConnect = walletConnectModule();

const ledger = ledgerModule();
const MAINNET_RPC_URL = "https://rinkeby.infura.io/v3/10cbe50adfe646ad97343d4d313a2314" || process.env.REACT_APP_INFURA;

//console.log("---MAINNET_RPC_URL----",MAINNET_RPC_URL)

 const initWeb3Onboard = init({
  wallets: [injected, ledger, walletLink, walletConnect],
  chains: [
      {
          id: "0x1",
          token: "ETH",
          label: "Ethereum Mainnet",
          rpcUrl: MAINNET_RPC_URL
      },
      {
          id: "0x3",
          token: "tROP",
          label: "Ethereum Ropsten Testnet",
          rpcUrl: MAINNET_RPC_URL,
      },
      {
          id: "0x4",
          token: "rETH",
          label: "Ethereum Rinkeby Testnet",
          rpcUrl: MAINNET_RPC_URL,
      },
      {
          id: "0x89",
          token: "MATIC",
          label: "Matic Mainnet",
          rpcUrl: "https://matic-mainnet.chainstacklabs.com",
      },
      {
          id:"0xa4b1",
          token:'EMAX',
          label: "Arbitarium",
          rpcUrl:MAINNET_RPC_URL

      }
  ],
  appMetadata: {
    name: "Blocknative Web3-Onboard",
    icon: "/logo.png",
    logo: "/logo.png",
    description: "Demo app for Web3-Onboard",
    recommendedInjectedWallets: [
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
});

export default initWeb3Onboard;
