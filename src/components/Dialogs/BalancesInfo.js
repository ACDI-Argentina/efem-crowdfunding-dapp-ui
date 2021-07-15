import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import config from '../../configuration';
import TokenAvatar from 'components/TokenAvatar';

import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { Grid } from '@material-ui/core';

const BalanceContainer = styled.div`
  display: flex;
  
  justify-content: space-evenly;
  flex-wrap: wrap;
  flex-direction:column;
  align-items:center;
  min-height:210px;

  @media (min-width: 860px) {
    flex-direction:row;
    min-height:70px;
  }
`

const BalanceTitle = styled.div`
  font-size: 1.25rem;
  line-height: 1.3rem;
  margin-top: 25px;
  font-weight: 400;
`

const TokenBalance = styled.div`
  display:flex;
  flex-direction:row;
  padding:15px;
  align-items:center;
  justify-content:center;
  min-width: 215px;
`

const Value = styled.div`
   font-weight:bold;
   padding: 0px 10px;
`


const BalancesInfo = ({}) => {
  const currentUser = useSelector(selectCurrentUser);
  const { web3, explorer } = useContext(Web3AppContext);
  const sanitizedExplorer = explorer?.endsWith('/') ? explorer?.slice(0, -1) : explorer;
  

  const formatBalance = (balance, decimals = 10) => {
    // BN instance
    const formattedBalance = parseFloat(web3.utils.fromWei(balance.toString()))?.toFixed(decimals);
    return formattedBalance;
  };


  return (
    <Grid container item direction="column" justify="center" xs={12}>
      <BalanceTitle>Balance info</BalanceTitle>
      <BalanceContainer>
        {Object.keys(config.tokens).map((tokenKey) => {
          const token = config.tokens[tokenKey];
          const balance = currentUser.tokenBalances[token.address];
          if (!balance) return null;

          return (
            <TokenBalance key={token.symbol}>
              <Value>{formatBalance(balance, token.showDecimals)}</Value>
              {token.isNative ? (
                token.symbol
              ) : (
                <a
                  target="_blank"
                  href={`${sanitizedExplorer}/address/${token.address}`}
                  rel="noreferrer"
                >
                  {' '}
                  {token.symbol}
                </a>
              )}

              <TokenAvatar tokenAddress={token.address} />
            </TokenBalance>
          );
        })}
      </BalanceContainer>
    </Grid>
  );
};

export default BalancesInfo;
