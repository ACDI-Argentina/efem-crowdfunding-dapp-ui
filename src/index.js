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
import MessageListener from 'redux/listeners/MessageListener';

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
      main: '#43E0A9',
      light: '#8efed7',
      dark: '#004634'
    },
    secondary: {
      main: '#F8652F',
      light: '#ff9a75',
      dark: '#C43700'
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828'
    },
    text: {
      primary: '#000000',
      secondary: '#BDBDBD'
    }
  },
  typography: {
    fontFamily: 'Poppins',
    h3: {
      fontWeight: 600
    },
    h5: {
      fontWeight: 600
    }
  }
});

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Se inicializan listeners entre Managers comunes y Redux.
new AccountListener();
new MessageListener();
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
