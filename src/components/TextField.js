/**
*
* TextField
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import MuiTextField from '@material-ui/core/TextField';

class TextField extends React.PureComponent {
  delayedChangeTimer = null;

  handleTextFieldChange = (e) => {
    const { onChange, onTimeout, timeoutDelay } = this.props;

    if (onChange) {
      onChange(e);
    }

    if (!onTimeout) {
      // If there's no change handler there's no need for action.
      return;
    }

    const value = e.target.value;

    if (timeoutDelay) {
      if (this.delayedChangeTimer) {
        clearTimeout(this.delayedChangeTimer);
      }

      this.delayedChangeTimer = setTimeout(() => {
        onTimeout(value);
      }, timeoutDelay);
    } else {
      // If this TextField has no change delay, simply pass the event on to its listener
      onTimeout(value);
    }
  };

  render() {
    const { onChange, onTimeout, timeoutDelay, ...rest } = this.props;
    return (
      <MuiTextField onChange={this.handleTextFieldChange} {...rest} />
    );
  }
}

TextField.propTypes = {
  onChange: PropTypes.func,
  onTimeout: PropTypes.func,
  timeoutDelay: PropTypes.number,
};

TextField.defaultProps = {
  timeoutDelay: 0,
};

export default TextField;
