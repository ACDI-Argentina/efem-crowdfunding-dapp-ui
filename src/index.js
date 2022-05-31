import React from 'react';
import ReactDOM from 'react-dom';

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
  }
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Application />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
