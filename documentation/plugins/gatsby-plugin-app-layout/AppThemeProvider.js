import PropTypes from 'prop-types';
import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';

import theme from './theme';

function AppThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

AppThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default AppThemeProvider;
