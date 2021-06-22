import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { selectCurrentUser } from '../redux/reducers/currentUserSlice';
import { useSelector } from 'react-redux';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { toChecksumAddress } from 'lib/blockchain/Web3Utils';
import AccountDetailsModal from 'components/Dialogs/AccountDetailsModal';

import { withTranslation } from 'react-i18next';


const Wrapper = styled.div``;

const AddressWrapper = styled.div`
  display: flex;
  align-items:center;
`;

const WalletIndicator = styled.div`
  padding: 0px 5px;
`;

const AddressLabel = styled.div`
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  padding: 3px 20px;
  border-radius: 24px;

  ${(props) =>
    props.success &&
    `
    color: #53a653;
    border: 1px solid #53a653;
    background-color: #48d24838;
  `}

  ${(props) =>
    props.warning &&
    `
    color: #ffc107;
    border: 1px solid #ffc107;
    background-color: #ffc10738;
  `}
`;
const ConnectButton = styled.button`
  font-size: 16px;
  margin: 10px;
  background-color: #53a653;
  cursor: pointer;
  padding: 3px 20px;
  border-radius: 24px;
  border: 0px;
  color: white;
  text-transform: capitalize;
  font-weight: bold;

  transition: 0.3s;

  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
              0px 2px 2px 0px rgba(0, 0, 0, 0.14),
              0px 1px 5px 0px rgba(0, 0, 0, 0.12);

  :hover{
    box-shadow: 0 4px 2px 0 rgba(0,0,0,0.2);
  } 
`;

const Connect = (props) => {
  const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const addr = toChecksumAddress(currentUser?.address);
  const {t} = props;
  const {
    loginAccount,
    network,
    web3,
  } = useContext(Web3AppContext);

  const isCorrectNetwork = network?.isCorrect || false;
  const success = isCorrectNetwork;
  const warning = !isCorrectNetwork;

  let walletIndicator = null;

  if(web3.wallet && web3.wallet.logoUrl){
    walletIndicator = (
      <WalletIndicator>
        <img src={web3.wallet.logoUrl} style={{ width: '25px' }} />
      </WalletIndicator>
    );
  }

  return (
    <>
      <Wrapper>
        {currentUser?.address && (
          <AddressWrapper>
            {walletIndicator}

            <AddressLabel
              success={success}
              warning={warning}
              onClick={() => setShowAccountDetailsModal(true)}
              title={isCorrectNetwork ? `${addr}` : `INCORRECT NETWORK - ${addr}`}
            >
              {`${addr.slice(0, 6)}...${addr.slice(-4)}`}
            </AddressLabel>
          </AddressWrapper>
        )}
        {!currentUser.address && (
          <ConnectButton onClick={() => loginAccount()}>{t('connectWallet')}</ConnectButton>
        )}
      </Wrapper>

      <AccountDetailsModal
        address={addr}
        fullWidth={true}
        maxWidth="md"
        open={showAccountDetailsModal}
        onClose={() => setShowAccountDetailsModal(false)}
      ></AccountDetailsModal>
    </>
  );
};

export default withTranslation()(Connect);