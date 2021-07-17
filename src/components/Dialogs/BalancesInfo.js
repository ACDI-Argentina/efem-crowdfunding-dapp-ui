import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import config from '../../configuration';

import { selectCurrentUser } from '../../redux/reducers/currentUserSlice';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { Grid } from '@material-ui/core';
import TokenUserBalance from 'components/TokenUserBalance';

const BalanceWrapper = styled.div`
  boder:2px solid tomato;
  min-height:235px;

  @media (min-width: 860px) {
    flex-direction:row;
    min-height:95px;
  }
`

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

const STokenBalance = styled.div`
  display:flex;
  flex-direction:row;
  padding:15px;
  align-items:center;
  justify-content:center;
  min-width: 215px;
`

const BalancesInfo = ({ }) => {
  const currentUser = useSelector(selectCurrentUser);
  const { web3, explorer } = useContext(Web3AppContext);
  const sanitizedExplorer = explorer?.endsWith('/') ? explorer?.slice(0, -1) : explorer;

  const balances = Object.keys(config.tokens).map((tokenKey) => {
    const token = config.tokens[tokenKey];
    const balance = currentUser.tokenBalances[token.address]; //what if there is no balance?
    return { balance, token };
  }).filter(entry => entry.balance);


  return (
    <Grid container item direction="column" justify="center" xs={12}>
      <BalanceWrapper>
        {balances?.length && (
          <>
            <BalanceTitle>Balance info</BalanceTitle>
            <BalanceContainer>
              {
                balances.map(({ token }) => (
                  <STokenBalance key={token.symbol}>
                    <TokenUserBalance tokenAddress={token.address} />
                  </STokenBalance>
                ))
              }
            </BalanceContainer>
          </>
        )}
      </BalanceWrapper>
    </Grid>
  );
};

export default BalancesInfo;
