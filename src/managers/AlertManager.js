/**
*
* AlertManager
*
*/

import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';

import { observable } from 'mobx';
import { observer } from 'mobx-react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

class AlertManager extends React.Component {
  static queue = observable.map();

  static alert(alertInfo, type) {
    alertInfo.ALERT_TYPE = type;
    const key = new Date().getTime();
    this.queue.set(key, alertInfo);
  }

  static info(alertInfo) {
    this.alert(alertInfo, 'info');
  }

  static confirm(alertInfo) {
    this.alert(alertInfo, 'confirm');
  }

  static prompt(alertInfo) {
    this.alert(alertInfo, 'prompt');
  }

  static async dismiss(key, value) {
    const alertInfo = this.queue.get(key);
    if (alertInfo.onDismiss) {
      let returnValue = value;
      if (typeof(returnValue) === 'function') {
        returnValue = returnValue();
      }
      await alertInfo.onDismiss(returnValue);
    }
    this.queue.delete(key);
  }

  get dialogs() {
    const dialogs = [];
    AlertManager.queue.forEach((alertInfo, key) => {
      const alertType = alertInfo.ALERT_TYPE;
      let commitValue = true;

      let promptField = null;
      if (alertType === 'prompt') {
        const promptFieldRef = React.createRef();
        promptField = (
          <TextField
            autoFocus
            inputRef={promptFieldRef}
            margin="dense"
            label={alertInfo.label}
            fullWidth
          />
        );
        commitValue = () => {
          return promptFieldRef.current.value;
        };
      }

      const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          AlertManager.dismiss(key, commitValue);
        }
      };

      dialogs.push((
        <Dialog
          key={key}
          fullWidth={true}
          maxWidth='sm'
          open
          onKeyPress={handleKeyPress}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{alertInfo.title}</DialogTitle>
          <DialogContent>
            {alertInfo.description &&
              <DialogContentText id="alert-dialog-description">
                {alertInfo.description}
              </DialogContentText>
            }
            {promptField}
          </DialogContent>

          <DialogActions>
            {alertInfo.ALERT_TYPE !== 'info' &&
              <Button onClick={() => { AlertManager.dismiss(key, false); }}>
                {alertInfo.cancelButtonTitle || 'Cancel'}
              </Button>
            }

            <Button
              color="primary"
              onClick={() => { AlertManager.dismiss(key, commitValue); }}
            >
              {alertInfo.confirmButtonTitle || 'OK'}
            </Button>
          </DialogActions>
        </Dialog>
      ));
    });
    return dialogs;
  }

  render() {
    return (
      <Fragment>
        {this.dialogs}
      </Fragment>
    );
  }
}

export default observer(AlertManager);
