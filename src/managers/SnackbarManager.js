import PropTypes from 'prop-types';
import React from 'react';

import { observable } from 'mobx';

import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

//------------------------------------------------------------------------------
const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

function MessageSnackbarContent(props) {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

MessageSnackbarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MessageSnackbarContentWrapper = withStyles((theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: blue[400],
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}))(MessageSnackbarContent);

//------------------------------------------------------------------------------
class SnackbarManager extends React.Component {
  static queue = observable.array();

  static addMessage(messageInfo) {
    this.queue.push({
      key: new Date().getTime(),
      ...messageInfo,
    });
  }

  static success(message) {
    this.addMessage({ message, variant: 'success' });
  }

  static info(message) {
    this.addMessage({ message, variant: 'info' });
  }

  static warning(message) {
    this.addMessage({ message, variant: 'warning' });
  }

  static error(err, defaultMessage) {
    let message = defaultMessage;
    if (typeof(err) === 'string') {
      message = err;
    } else {
      // // TODO: Construct an error from the response body
      // if (err.response && err.response.body) {
      //   console.log(err.response.body);
      // }
    }
    this.addMessage({ message, variant: 'error' });
  }

  state = {
    isOpen: false,
    messageInfo: {},
  };

  componentDidMount() {
    this.observeQueueDisposer = SnackbarManager.queue.observe(
      this.handleQueueChange
    );
  }

  componentWillUnmount() {
    this.observeQueueDisposer();
  }

  handleQueueChange = (changeInfo) => {
    if (changeInfo.addedCount) {
      if (this.state.isOpen) {
        // immediately begin dismissing current message
        // to start showing new one
        this.setState({ isOpen: false });
      } else {
        this.processQueue();
      }
    }
  };

  processQueue = () => {
    if (SnackbarManager.queue.length > 0) {
      this.setState({
        messageInfo: SnackbarManager.queue.shift(),
        isOpen: true,
      });
    }
  };

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({isOpen: false });
  };

  handleExited = () => {
    this.processQueue();
  };

  render() {
    return (
      <div>
        <Snackbar
          key={this.state.messageInfo.key}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={this.state.isOpen}
          autoHideDuration={3000}
          onClose={this.handleClose}
          onExited={this.handleExited}
        >
          <MessageSnackbarContentWrapper
            variant={this.state.messageInfo.variant}
            className={this.props.classes.margin}
            message={this.state.messageInfo.message}
            onClose={this.handleClose}
          />
        </Snackbar>
      </div>
    );
  }
}

SnackbarManager.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles((theme) => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
}))(SnackbarManager);