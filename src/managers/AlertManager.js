import clsx from 'clsx';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
import HelpIcon from '@material-ui/icons/Help';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';

const TITLE_ICON_MAP = {
  'confirm': HelpIcon,
  'error': ErrorIcon,
  'info': InfoIcon,
  'warn': WarningIcon,
};

const alertStyles = makeStyles((theme) => ({
  dialogContent: {
    display: 'flex',
    padding: theme.spacing(1, 2),
  },

  dialogTitleHeading: {
    fontSize: theme.typography.pxToRem(18),
    textTransform: 'capitalize',
  },

  dialogContentText: {
    fontSize: theme.typography.pxToRem(16),
    marginTop: theme.spacing(1),
  },

  titleIcon: {
    fontSize: theme.typography.pxToRem(40),
    marginRight: theme.spacing(1),

    '&.info': theme.mixins.status.infoColor,
    '&.warn': theme.mixins.status.warningColor,
    '&.error': theme.mixins.status.errorColor,
  },
}));

function AlertDialog({ alertInfo, onDismiss }) {
  const classes = alertStyles();

  const cancel = () => {
    onDismiss(false, alertInfo);
  };

  const commit = () => {
    onDismiss(true, alertInfo);
  };

  const handleEscapeKeyDown = () => {
    if (alertInfo.type === 'confirm') {
      cancel();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      commit();
    }
  };

  const TitleIcon = TITLE_ICON_MAP[alertInfo.type];

  return (
    <Dialog
      disableBackdropClick
      fullWidth={true}
      maxWidth='sm'
      open
      onKeyPress={handleKeyPress}
      onEscapeKeyDown={handleEscapeKeyDown}
    >
      {alertInfo.title &&
        <DialogTitle disableTypography>
          <Typography component="h2" className={classes.dialogTitleHeading}>
            {alertInfo.title}
          </Typography>
        </DialogTitle>
      }

      <DialogContent className={classes.dialogContent}>
        <TitleIcon className={clsx([classes.titleIcon, alertInfo.type])} />

        {alertInfo.description &&
          <DialogContentText className={classes.dialogContentText}>
            {alertInfo.description}
          </DialogContentText>
        }
      </DialogContent>

      <DialogActions>
        {alertInfo.type === 'confirm' &&
          <Button
            onClick={() => cancel()}
          >
            {alertInfo.cancelButtonTitle || 'Cancel'}
          </Button>
        }

        <Button
          color="primary"
          onClick={() => commit()}
        >
          {alertInfo.confirmButtonTitle || 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AlertDialog.propTypes = {
  alertInfo: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

// -----------------------------------------------------------------------------

class AlertManager extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      queue: new Map()
    };

    AlertManager.__instance = this;
  }

  static enqueueAlert(alertInfo, type) {
    AlertManager.__instance.__enqueueAlert({
      ...alertInfo,
      type,
      key:new Date().getTime()
    });
  }

  static info(alertInfo) {
    this.enqueueAlert(alertInfo, 'info');
  }

  static warn(alertInfo) {
    this.enqueueAlert(alertInfo, 'warn');
  }

  static error(alertInfo) {
    this.enqueueAlert(alertInfo, 'error');
  }

  static confirm(alertInfo) {
    this.enqueueAlert(alertInfo, 'confirm');
  }

  // ---------------------------------------------------------------------------

  __enqueueAlert = (alertInfo) => {
    const updatedQueue = new Map(this.state.queue);
    updatedQueue.set(alertInfo.key, alertInfo);
    this.setState({ queue: updatedQueue });
  };


  handleAlertDialogDismiss = (value, alertInfo) => {
    if (typeof(alertInfo.onDismiss) === 'function') {
      alertInfo.onDismiss(value);
    }

    const updatedQueue = new Map(this.state.queue);
    updatedQueue.delete(alertInfo.key);
    this.setState({ queue: updatedQueue });
  };


  render() {
    const dialogs = [];
    this.state.queue.forEach((alertInfo) => {
      dialogs.push(
        <AlertDialog
          alertInfo={alertInfo}
          key={alertInfo.key}
          onDismiss={this.handleAlertDialogDismiss}
        />
      );
    });

    return dialogs;
  }
}

export default AlertManager;
