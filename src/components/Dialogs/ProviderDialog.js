import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import { Typography, Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Heading } from "rimble-ui";

const Wrapper = styled.div`
  padding:10px;
  min-height:30vh;
  display: flex;
  flex-direction: column;
  
`
const TitleContainer = styled.div`
  padding:10px;
  display:flex;
  justify-content: space-between;
  align-items: center;

  font-family:"Raleway";
  font-weight: 600;
  line-height: 1.25;
  font-size: 32px;
`
const CloseContainer = styled.div`
  cursor:pointer;
  color:#CCCCCC;
`

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content:center;
  padding:25px 40px;
`
const SCard = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  padding: 5px;
  margin: 10px;
  border-radius: 10px;
  cursor:pointer;

  display:flex;
  flex-direction:column;
  justify-content: space-around;
  align-items: center;

  /* xs */
  height: 120px;
  width: 120px;

  @media (min-width: 576px) {
  }
  @media (min-width: 768px) {
    height: 150px;
    width: 150px;
  }

  @media (min-width: 992px) {
  }

  @media (min-width: 1200px) {
  }
  
  :hover{
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  } 

`
const IconImage = styled.img`
  max-width:50px;
  @media (min-width: 768px) {
    max-width:70px;
  }
  
`
const CardName = styled.span`
  text-align:center;
  font-size: 0.8em;
  line-height: 1em;
`


const MetamaskImage = (
  <IconImage
    src={require("assets/img/MetaMaskIcon.svg")}
    ariaLabel="MetaMask extension icon"
    size="40px"
  />
);

const WalletConnectImage = (
  <IconImage
    src={require("assets/img/WalletConnectIcon.svg")}
    ariaLabel="Wallet Connect icon"
    size="40px"
  />
);


const PortisImage = (
  <IconImage
    src={require("assets/img/PortisIcon.png")}
    ariaLabel="Portis Connect icon"
    size="40px"
  />
);

const SImageWrapper = styled.div`
  flex: 0.6;
  justify-content: center;
  display: flex;
`

const Card = ({ onClick, name, image }) => (
  <SCard onClick={onClick}>
    <SImageWrapper>
      {image}
    </SImageWrapper>
    <CardName>
      {name}
    </CardName>
  </SCard>
)


const ProviderDialog = ({ onSelect, onClose, ...props }) => {
  return (
    <Dialog
      onClose={onClose}
      {...props}
    >
      <Wrapper>
        <TitleContainer>
          <Heading.h3>
            Select a provider
          </Heading.h3>
          <CloseContainer onClick={() => onClose()}>
            <CloseIcon style={{ display: "block" }} />
          </CloseContainer>
        </TitleContainer>
        <CardsContainer>
          <Card
            onClick={() => onSelect("Metamask")}
            name="Metamask"
            image={MetamaskImage} />
          <Card
            onClick={() => onSelect("WalletConnect")}
            name="Wallet Connect"
            image={WalletConnectImage}
          />
          {/* <Card name="Portis" image={PortisImage} /> */}
        </CardsContainer>
      </Wrapper>
    </Dialog>
  )
}
export default ProviderDialog;  
