import clsx from 'clsx';

import PropTypes from 'prop-types';
import React from 'react';

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

import FormDialog from '../components/FormDialog';
import { timestamp } from '../util/date';

const TITLE_ICON_MAP = {
  'default': HelpIcon,
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
  },

  dialogContentText: {
    fontSize: theme.typography.pxToRem(16),
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

  const handleDialogClose = (e, reason) => {
    if (reason === 'escapeKeyDown') {
      cancel();
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      commit();
    }
  };

  const TitleIcon = TITLE_ICON_MAP[alertInfo.variant];

  return (
    <Dialog
      fullWidth={true}
      maxWidth='xs'
      open
      onClose={handleDialogClose}
      onKeyPress={handleKeyPress}
      {...(alertInfo.dialogProps || {})}
    >
      {alertInfo.title &&
        <DialogTitle disableTypography>
          <Typography component="h2" className={classes.dialogTitleHeading}>
            {alertInfo.title}
          </Typography>
        </DialogTitle>
      }

      <DialogContent className={classes.dialogContent}>
        <TitleIcon className={clsx([classes.titleIcon, alertInfo.variant])} />

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
          color={alertInfo.variant === 'warn' ? 'secondary' : 'primary'}
          onClick={() => commit()}
          variant="contained"
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


/**
 * Convenience facility for the presentation of informational dialogs
 *
 * @public
 */
class AlertManager extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      alertQueue: new Map(),
      promptQueue: new Map(),
    };

    AlertManager.__instance = this;
  }

  // ---------------------------------------------------------------------------
  static prompt(promptInfo) {
    AlertManager.__instance.__enqueuePrompt({
      ...promptInfo,
      key: timestamp(),
    });
  }

  __enqueuePrompt = (promptInfo) => {
    const updatedQueue = new Map(this.state.promptQueue);
    updatedQueue.set(promptInfo.key, promptInfo);
    this.setState({ promptQueue: updatedQueue });
  };

  handleFormDialogClose = (promptInfo) => (formData) => {
    if (promptInfo) {
      promptInfo.onDismiss(formData);
    }

    const updatedQueue = new Map(this.state.promptQueue);
    updatedQueue.delete(promptInfo.key);
    this.setState({ promptQueue: updatedQueue });
  };

  // ---------------------------------------------------------------------------
  static _enqueueAlert(alertInfo, type, variant) {
    AlertManager.__instance.__enqueueAlert({
      ...alertInfo,
      type,
      variant,
      key: timestamp(),
    });
  }

  static info(alertInfo) {
    this._enqueueAlert(alertInfo, 'prompt', 'info');
  }

  static warn(alertInfo) {
    this._enqueueAlert(alertInfo, 'prompt', 'warn');
  }

  static error(alertInfo) {
    this._enqueueAlert(alertInfo, 'prompt', 'error');
  }

  static confirm(alertInfo, variant) {
    this._enqueueAlert(alertInfo, 'confirm', variant || 'default');
  }

  __enqueueAlert = (alertInfo) => {
    const updatedQueue = new Map(this.state.alertQueue);
    updatedQueue.set(alertInfo.key, alertInfo);
    this.setState({ alertQueue: updatedQueue });
  };

  handleAlertDialogDismiss = (value, alertInfo) => {
    if (typeof(alertInfo.onDismiss) === 'function') {
      alertInfo.onDismiss(value);
    }

    const updatedQueue = new Map(this.state.alertQueue);
    updatedQueue.delete(alertInfo.key);
    this.setState({ alertQueue: updatedQueue });
  };

  // ---------------------------------------------------------------------------
  render() {
    const { alertQueue, promptQueue } = this.state;

    const dialogs = [];
    alertQueue.forEach((alertInfo) => {
      dialogs.push(
        <AlertDialog
          alertInfo={alertInfo}
          key={alertInfo.key}
          onDismiss={this.handleAlertDialogDismiss}
        />
      );
    });

    promptQueue.forEach((promptInfo) => {
      const { key, fieldName, title } = promptInfo;
      dialogs.push(
        <FormDialog
          fieldArrangement={[fieldName]}
          key={key}
          onClose={this.handleFormDialogClose(promptInfo)}
          title={title}
        />
      );
    })

    return dialogs;
  }
}

export default AlertManager;
