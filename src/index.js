import React from 'react';
import { createRoot } from 'react-dom/client';

import localForage from 'localforage';
import * as serviceWorker from './serviceWorker';
import Application from './containers/Application';
import './styles/application.css';
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "@mui/material/styles";

import './i18n/i18n';

import "assets/scss/material-kit-react.scss?v=1.9.0";
import AccountListener from 'redux/listeners/AccountListener';
import TransactionsListener from 'redux/listeners/TransactionesListener';

try {
  localForage
    .config({
      driver: [localForage.INDEXEDDB, localForage.WEBSQL, localForage.LOCALSTORAGE],
      name: 'mydb',
      storeName: 'mystore',
      version: 3,
    })
    .then(() => localForage.getItem('x'));
} catch (e) {
  // console.log(e);
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5D49'
    },
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
  },
  typography: {
    "fontFamily": '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
   }
});

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Se inicializan listeners entre Managers comunes y Redux.
new AccountListener();


new TransactionsListener();

root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Application />
    </ThemeProvider>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
