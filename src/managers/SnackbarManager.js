import React from 'react';

import { withSnackbar } from 'notistack';

/**
 * A higher-order component used to simplify usage of the notistack library.
 *
 * To use the SnackbarManager, insert a _single instance_ at the top of your
 * component hierarchy, then anywhere in your application that you wish to
 * present a snackbar notification, simply import the class and invoke
 * any of its static methods (info, success, error, etc.).
 * @public
 */
class SnackbarManager extends React.PureComponent {
  constructor(props) {
    super(props);

    SnackbarManager.__instance = this;
  }

  static notify(messageInfo) {
    SnackbarManager.__instance.__notify(messageInfo);
  }

  static success(message) {
    this.notify({ message, variant: 'success' });
  }

  static info(message) {
    this.notify({ message, variant: 'info' });
  }

  static warning(message) {
    this.notify({ message, variant: 'warning' });
  }

  static error(err, defaultMessage) {
    let message = defaultMessage;
    if (typeof(err) === 'string') {
      message = err;
    }
    this.notify({ message, variant: 'error' });
  }


  __notify = (messageInfo) => {
    this.props.enqueueSnackbar(messageInfo.message, {
      variant: messageInfo.variant
    });
  };


  render() {
    // This component requires no output.
    return null;
  }
}


export default withSnackbar(SnackbarManager);