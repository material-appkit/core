import PropTypes from 'prop-types';
import React from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

function ProgressButton(props) {
  const {
    children,
    progress,
    ...buttonProps
  } = props;

  return (
    <Button
      disabled={progress !== null}
      startIcon={progress === undefined ? (
        <CircularProgress size={16} color="inherit" />
      ) : null}
      variant="contained"
      {...buttonProps}
    >
      {children}
    </Button>
  );
}

ProgressButton.propTypes = {
  children: PropTypes.any,
  progress: PropTypes.number,
};

export default ProgressButton;
