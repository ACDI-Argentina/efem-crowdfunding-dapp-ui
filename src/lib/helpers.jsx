import React from 'react';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import 'whatwg-fetch';
import { createBrowserHistory } from 'history';
import moment from 'moment';

import DefaultAvatar from '../assets/avatar-100.svg';
import config from '../configuration';
import { web3Utils } from 'commons';

export const isOwner = (address, user) => {
  return address !== undefined && user !== undefined && web3Utils.addressEquals(address, user.address);
}
  

export const getTruncatedText = (text = '', maxLength = 45) => {
  const txt = text
    .replace(/<\/(?:.|\n)*?>/gm, ' ') // replace closing tags w/ a space
    .replace(/<(?:.|\n)*?>/gm, '') // strip opening tags
    .trim();
  if (txt.length > maxLength) {
    return `${txt.substr(0, maxLength).trim()}...`;
  }
  return txt;
};

// displays a sweet alert with an error when the transaction goes wrong
export const displayTransactionError = txHash => {
  let msg;
  const { etherScanUrl } = config;
  if (txHash) {
    msg = (
      <p>
        Something went wrong with the transaction.
        <a href={`${etherScanUrl}tx/${txHash}`} target="_blank" rel="noopener noreferrer">
          View transaction
        </a>
      </p>
    );
    // TODO: update or remove from feathers? maybe don't remove, so we can inform the user that the
    // tx failed and retry
  } else {
    msg = <p>Something went wrong with the transaction. Is your wallet unlocked?</p>;
  }

  React.swal({
    title: 'Oh no!',
    content: React.swal.msg(msg),
    icon: 'error',
  });
};

// returns the user name, or if no user name, returns default name
export const getUserName = owner => {
  if (owner && owner.name) {
    return owner.name;
  }
  return 'Anonymous user';
};

// returns the user avatar, or if no user avatar, returns default avatar
export const getUserAvatar = owner => {
  if (owner && owner.avatar) {
    return owner.avatar;
  }
  return DefaultAvatar;
};

export const getRandomWhitelistAddress = wl => wl[Math.floor(Math.random() * wl.length)].address;

export const getReadableStatus = status => {
  switch (status) {
    case 'InProgress':
      return 'In progress';
    case 'NeedsReview':
      return 'Needs review';
    default:
      return status;
  }
};

export const history = createBrowserHistory();


export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}



// Get start of the day in UTC for a given date or start of current day in UTC
export const getStartOfDayUTC = date => moment.utc(date || moment()).startOf('day');

// the back button will go one lower nested route inside of the DApp
// removes the last pathname from the url and pushes that location

export const goBackOnePath = () => {
  let url = history.location.pathname.split('/');
  url.pop();
  url = url.join('/');
  history.push(url);
};

/**
 * If path is an ipfsUrl, return just the ipfs path, otherwise returns the path param
 *
 * @param {string} path the path to clean
 */
export const cleanIpfsPath = path => {
  const re = new RegExp(/\/ipfs\/\w+$/);

  const match = re.exec(path);
  if (match) {
    return match[0];
  }
  return path;
};
