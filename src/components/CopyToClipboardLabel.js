import PropTypes from 'prop-types';
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.palette.primary.main,
    cursor: 'pointer',
    fontSize: '100%',
    padding: 0,

    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

function CopyToClipboardLabel(props) {
  const classes = styles();
  const { value } = props;

  return (
    <input
      className={classes.input}
      value={value}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        const inputField = e.target;
        inputField.setSelectionRange(0, value.length);

        if (document.execCommand('copy')) {
          if (props.onCopy) {
            props.onCopy(value);
          }
        }
        inputField.blur();
        inputField.setSelectionRange(0, 0);
      }}
      onChange={null}
      readOnly
    />
  );
}

CopyToClipboardLabel.propTypes = {
  onCopy: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default CopyToClipboardLabel;
