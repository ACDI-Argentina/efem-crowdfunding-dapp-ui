import React, { useState,useContext } from 'react';
import styled from 'styled-components';

import { Grid, Tooltip } from '@material-ui/core';
import { Web3AppContext } from 'lib/blockchain/Web3App';

const LinkButton = styled.a`
  color: #53a653;
  font-weight: 600;
  padding: 10px;
  :hover {
    text-decoration: underline;
    color: #53a653;
  }
`;

const Address = styled.div`
  font-family: Rubik, sans-serif;
  font-weight: 400;
  font-size: 1.3em;
  padding: 1em;
  color: gray;
  word-break: break-all;
`;

const CopyAddress = styled.div`
  font-weight: bold;
  cursor: pointer;
  padding: 10px;
  color: #53a653;
`;

const AccountActionsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  @media (min-width: 860px) {
    flex-direction: row;
  }
`;

const AccountInfo = ({ address }) => {
  const { explorer } = useContext(Web3AppContext);
  const sanitizedExplorer = explorer?.endsWith('/') ? explorer?.slice(0, -1) : explorer;
  const explorerLink = `${sanitizedExplorer}/address/${address}`;

  const [showTooltip, setShowTooltip] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(address);
    // show popup copied!by a seconds
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1000);
  }

  return (
    <>
      <Grid container item justifyContent="center" xs={12}>
        <Address>{address}</Address>
      </Grid>
      <AccountActionsContainer>
        <Grid container justifyContent="center" align="center" item sm={4} xs={12}>
          <LinkButton target="_blank" href={explorerLink}>
            View on RSK explorer
          </LinkButton>
        </Grid>
        <Grid container justifyContent="center" align="center" item sm={4} xs={12}>
          <Tooltip open={showTooltip} title="Copied!" placement="top">
            <CopyAddress onClick={copyToClipboard}>
              Copy address <i className="far fa-copy" />
            </CopyAddress>
          </Tooltip>
        </Grid>
      </AccountActionsContainer>
    </>
  );
};

export default AccountInfo;
