import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectExchangeRateByToken } from '../redux/reducers/exchangeRatesSlice';
import FiatAmount from "./FiatAmount";
import BigNumber from 'bignumber.js';
import config from '../configuration';

const { nativeToken } = config;

/**
 * Recibe una cantidad de tokens en wei y muestre el equivalente en fiat.
 */
const FiatAmountByToken = ({
    tokenAddress = nativeToken.address,
    amount: tokenAmountWei = 0
}) => {
    const [fiatAmount, setFiatAmount] = useState();
    const [tokenAmount, setTokenAmount] = useState();
    const exchangeRate = useSelector(state => selectExchangeRateByToken(state, tokenAddress));
    const rate = exchangeRate?.rate;
    

    useEffect(() => {
        try {
            if(!rate) return;
            const centsFiatAmount = tokenAmountWei.dividedBy(rate);
            setFiatAmount(centsFiatAmount.toString());
            setTokenAmount(tokenAmount);
        } catch (err) {
            console.error('Error transformando monto crypto en fiat.', err);
        }
    }, [tokenAddress, tokenAmountWei, rate])

    if(!rate){
        return null;
    }
    return (
        <Typography variant="body1">
            <FiatAmount amount={new BigNumber(fiatAmount)} />
        </Typography>
    )
}

FiatAmountByToken.propTypes = {
    tokenAddress: PropTypes.string,
    amount: PropTypes.instanceOf(BigNumber).isRequired,
};

export default FiatAmountByToken;