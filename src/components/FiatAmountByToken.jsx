import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectExchangeRateByToken } from '../redux/reducers/exchangeRatesSlice';
import FiatAmount from "./FiatAmount";
import BigNumber from 'bignumber.js';
import config from '../configuration';

const { nativeToken } = config;

{/* recibe una cantidad de tokens en wei y muestre el equivalente en fiat */ }
const FiatAmountByToken = ({ tokenAddress = nativeToken.address, amount: tokenAmountWei = 0 }) => {
    const [fiatAmount, setFiatAmount] = useState();
    const [tokenAmount, setTokenAmount] = useState();
    const { rate } = useSelector(state => selectExchangeRateByToken(state, tokenAddress)); 


    useEffect(() => {
        try {
            const centsFiatAmount = tokenAmountWei.dividedBy(rate);
            //const tokenAmount = Web3Utils.weiToEther(tokenAmountWei);
            setFiatAmount(centsFiatAmount.toString());
            setTokenAmount(tokenAmount);
        } catch (err) {
            console.log(err)
        }
    })

    return (
        <Typography variant="body1">
            {/*{tokenAmount} [{symbol}] = <FiatAmount amount={new BigNumber(fiatAmount)}/>*/}
            <FiatAmount amount={new BigNumber(fiatAmount)}/>
        </Typography>
    )
}


export default FiatAmountByToken;

FiatAmountByToken.propTypes = {
    tokenAddress: PropTypes.string,
    amount: PropTypes.instanceOf(BigNumber).isRequired,
};