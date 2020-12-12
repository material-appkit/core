import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import App from 'App.js';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { SnackbarProvider } from 'notistack';

import AlertManager from '@material-appkit/core/managers/AlertManager';
import NavManager from '@material-appkit/core/managers/NavManager';
import SnackbarManager from '@material-appkit/core/managers/SnackbarManager';


import theme from './theme';

// Enable error logging via Sentry.io
if (parseInt(process.env.REACT_APP_SENTRY_LOGGING) === 1) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_ID,
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT,
  });
}

NavManager.initialize({});


ReactDOM.render((
  <MuiThemeProvider theme={theme}>
    <SnackbarProvider
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      autoHideDuration={3000}
    >
      <CssBaseline />
      <SnackbarManager />
      <AlertManager />
      <App />
    </SnackbarProvider>
  </MuiThemeProvider>
), document.getElementById('root'));
