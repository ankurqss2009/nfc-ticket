import React, { useState, useEffect } from "react";
//import Image from "next/image";
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

import { isMobile } from "react-device-detect";
import "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
//import styles from "../styles/Home.module.css";

import { Slider } from "./Slider";

const Account = ({ address, setAddress }) => {
  //console.log("--setAccounts,accounts--",setAccounts,accounts)

  const connectedWallets = useWallets();

  useEffect(() => {
    if (!connectedWallets.length) return;

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    );
    window.localStorage.setItem(
      "connectedWallets",
      JSON.stringify(connectedWalletsLabelArray)
    );
  }, [connectedWallets]);

  // const handleDisconnect = async () => {
  //   /*const [primaryWallet] = initWeb3Onboard.state.get().wallets
  //       let res = await initWeb3Onboard.disconnectWallet()
  //       console.log("----res----",res)
  //       setAccounts(null);*/
  //   await disconnect(wallet);
  //   const connectedWalletsList = connectedWallets.map(({ label }) => label);
  //   window.localStorage.setItem("connectedWallets", null);
  //   localStorage.clear();
  // };

  return (
    <div className="right_inner_content">
      {/* <div className="container slide_header">
        <div className="row">
          <div className="col-6">
            <div className="wallet_code">
              <h5>NFC NFT</h5>
            </div>
          </div>
          <div className="col-6">
            <div className="wallet_connect">
              <div className="meta_wallet">
                <img className="meta_img" src="./MetaMask.png" alt="" />
                <img className="wallet_img" src="./wallet.png" alt="" />
              </div>
              <div className="connect_text">
                <span className="connect_dot"></span>
                <p>CONNECTED</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <Slider /> */}
    </div>
    /*<div>

        <div className="App">
          <div id="some-element"></div>
          <div className="header">
            <div className="logo">
              <img src="/Logo.png" alt="logo" className="inner_logo" />
            </div>
            <div className="right_btn">
              <img src="/secound_logo.png" alt="" className="inner_logo" />
              <div className="inner_btn">
                {!wallet && (
                    <button
                        className="connect_btn"
                        onClick={() => {
                          handleConnect(accounts);
                        }}
                    >
                      <span>{accounts || "Connect Wallet"}</span>
                    </button>
                )}
                {wallet && (
                    <button
                        className="connect_btn"
                        onClick={() => {
                          handleDisconnect();
                        }}
                    >
                      Disconnect
                    </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>*/
  );
};

export default Account;
