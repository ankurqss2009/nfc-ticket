import React, { useEffect, useState } from "react";

import { useMoralis, useMoralisWeb3Api } from "react-moralis";

import NoRecordFound from "../components/NoRecordFound";
import { addresses } from "../utils/Constant";
import {getContactProvider} from "../utils/ethereum";
import Barcode from "react-barcode";
import QRCode from 'qrcode';


const handleNFTList = async ({ address, Web3Api, nfts, setNfts, setLoading }) => {
  const account = address;
  setLoading(true)
  const options = {
    chain: process.env.REACT_APP_ENV === "dev" ? "rinkeby" : "Mainnet",
    address: account,
  };
  const nftsList = await Web3Api.account.getNFTs(options);
  const loadNftImage = async (nft) => {
    const fixeUrl = (token_uri) => {
      return token_uri + "?format=json";
    };
    let url = fixeUrl(nft.token_uri);
    if (
      url.startsWith("http") ||
      url.startsWith("https") ||
      url.startsWith("ipfs")
    ) {
      const response = await fetch(url);
      const urlObj = await response.json();
      if (urlObj.image.startsWith("ipfs")) {
        return (
          "https://ipfs.moralis.io:2053/ipfs/" +
          urlObj.image.split("ipfs://")[1]
        );
      }
      return urlObj.image;
    } else {
      return nft.token_uri;
    }
  };
  const attachNftImage = async (list) => {
    const contract_adr =
      addresses[process.env.REACT_APP_ENV === "dev" ? 4 : 1].Advisor;
    let response = [];
    for (const nft of list.result) {
      if (
        true ||
        contract_adr?.toLowerCase() === nft?.token_address?.toLowerCase()
      ) {
        let res = await loadNftImage(nft);
        let obj = Object.assign({}, { ...nft }, { image: res });
        response.push(obj);
      }
    }
    return response;
  };
  const list = await attachNftImage(nftsList);
  console.log("method respinse", nftsList);
  setNfts([...list]);
  setLoading(false)
};

const DEFAULT_TEXT = "0x5a667e0E29410Bc505B3CD361982C81F8ba28102";

const tokenIsLinkedWithNft = async({contract,address,token_id})=>{
     try{
      const response = await contract.methods.tokenIsLinked(token_id).call({from:address})
      console.log("response of ticket link ticketId",token_id,response)
      return !!response;
     }catch (e){
       console.log("error"+e)
     }
}
function NFTDetails({isLinked, token_id, setSelected}){
  let qrCodetText = token_id || DEFAULT_TEXT;

  const [qrCode, setQRCode] = useState("");

  const generateQR = async (token_id) => {
    try {
      return await QRCode.toDataURL(token_id);
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(()=>{
    generateQR(qrCodetText).then((res = "")=>{
      setQRCode(res);
    })
  }, [])

  return   (<div>
    <div className="back_blurr"></div>
    {isLinked && <div className={ "green_overlay_barcode"}>
      <div className="cross_icon">
        <img src="./cross.png" alt="" onClick={()=>{setSelected(null)}} />
      </div>
      <p className="barcode_title">
        Have an NFC Coordinator scan this code and you’re all set!
      </p>
     {/* <Barcode value={token_id} />*/}
      {qrCode ? <img src={qrCode} alt="" /> : null}
    </div>}
    {!isLinked && <div className="red_overlay_barcode">
      <div className="cross_icon">
        <img src="./cross.png" alt="" onClick={()=>{setSelected(null)}}/>
      </div>
      <p className="barcode_title">
        It seems you still need to link your ticket. Click the button below.
        Once complete, return to this page.
      </p>
      <p>{/*<Barcode value={token_id} />*/}{qrCode ? <img src={qrCode} alt="" /> : null}</p>
      <button >
        <img src="./Crystal.png" alt=""  /> <a target="_blank" onClick={()=>{setSelected(null)}}  style={{textDecoration:"none"}} href={process.env.REACT_APP_LINK_TICKET_URL}>LINK TICKET HERE</a>
      </button>
    </div>}
  </div>)
}

function NFT({ address, contract,record, handleSelect }) {
  const [isLinked, setIsLinked] = useState(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(null)

  const onSelect = async ({token_id})=>{
    setLoading(true)
    let res= await tokenIsLinkedWithNft({contract,address,token_id })
    setIsLinked(res);
    setSelected(token_id)
    setLoading(false)
  }

  return (
    <div
      className="col-md-4"
      onClick={() => {
      }}
    >
      <div className="box">
        <div className="box_img_btn">
          <p>
            NFC Ticket <span>{record.token_id}</span>
          </p>
          <img src="ticket.png" alt="ticket.png" />
          <div className="btn_overlay">
            <button
              onClick={() => {
                onSelect(record);
              }}
            >
              <img src="./Crystal.png" alt="" />{" "}
              {selected ? "SELECTED" : "SELECT"}
            </button>

          </div>
        </div>
        {loading && <div className="back_blurr"></div>}
        {selected &&<NFTDetails isLinked={isLinked} token_id={selected} setSelected={setSelected}></NFTDetails>}
      </div>
    </div>
  );
}

function WalletNFTList({
  address,
  contract,
  wallet
}) {
  //console.log("----ticketId---- in walletlist",ticketId)
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false)
  const [providerContract, setProviderContract] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState({
    token_id: null,
    token_address: null,
  });
  const [linkConfirmOpen, setLinkConfirmOpen] = useState(false);

  const handleSelect = ({ token_address, token_id }) => {
    setSelectedNFT({ token_address, token_id });
  };

  const handleRegister = () => {
    setLinkConfirmOpen(true);
  };

  const Web3Api = useMoralisWeb3Api();



  useEffect(() => {
    const init = async()=>{
      //alert("init contract"+contract)
      if(!contract && wallet){
        let res =  await  getContactProvider(wallet)
        setProviderContract(res);
       // alert("--contract"+contract)
      }
    }
    init()
    handleNFTList({ address, Web3Api, nfts, setNfts,setLoading });

  }, [address]);

  return (
    <div className="slider_inner">
      <div className="slider_inner_box slider_token_inner_box">
        {!nfts.length  && (
            <NoRecordFound message={loading ? "Loading Tokens" : "No NFT Found for this wallet"} />
        )}
        {nfts.length && <div className="container">
          <div className="row">
            <div className="ticket_subtitle">
              <p>Select your ticket for Check-in</p>
            </div>
          </div>
          <div className="row">
            {nfts.map((record, index) => {
              return (
                <NFT
                  key={index}
                  contract={contract || providerContract}
                  address={address}
                  record={record}
                  isLinked={false}
                  selected={selectedNFT?.token_id === record?.token_id}
                  handleSelect={handleSelect}
                />
              );
            })}
          </div>
        </div>}
      </div>
    </div>
  );
}
export default WalletNFTList;
