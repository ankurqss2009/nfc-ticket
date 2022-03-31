import React, { useState } from "react";
import { Carousel } from "react-bootstrap";

import WalletNFTList from '../components/WalletNFTList';

function Slider({address}) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };


  return (
    <div className="cart_slider">
      <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
        <Carousel.Item>
         { address && <WalletNFTList address={address}></WalletNFTList>}
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export { Slider };
