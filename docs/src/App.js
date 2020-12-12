import PropTypes from 'prop-types';
import React from 'react';

import Box from '@material-ui/core/Box';
import withWidth from '@material-ui/core/withWidth';


function App(props) {
  return (
    <Box>Hello Material-Appkit docs!</Box>
  );
}

App.propTypes = {
  width: PropTypes.string.isRequired,
};

export default withWidth()(App);
