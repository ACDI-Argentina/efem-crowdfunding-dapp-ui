import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import { Typography, Grid } from '@material-ui/core';


const Wrapper = styled.div`
  padding:10px;
  min-height:30vh;
  display: flex;
  flex-direction: column;
  
`
const TitleContainer = styled.div`
  padding:10px;
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
  height: 100px;
  width: 100px;
  padding: 5px;
  margin: 10px;
  border-radius: 10px;
  cursor:pointer;

  display:flex;
  flex-direction:column;
  justify-content: space-around;
  align-items: center;

  :hover{
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  } 

`
const IconImage = styled.img`
  max-width:50px;
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

const Card = ({ name, image }) => (
  <SCard>
    {image}
    <CardName>
      {name}
    </CardName>
  </SCard>
)


const ProviderDialog = ({ ...props }) => {
  return (
    <Dialog {...props}>
      <Wrapper>
        <TitleContainer>
          <Typography variant="h5">Select a provider</Typography>
        </TitleContainer>
        <CardsContainer>
          <Card name="Metamask" image={MetamaskImage} />
          <Card name="Wallet Connect" image={WalletConnectImage} />
          <Card name="Portis" image={PortisImage} />
        </CardsContainer>
      </Wrapper>
    </Dialog>
  )
}
export default ProviderDialog;
