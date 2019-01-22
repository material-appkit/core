/**
*
* AlertManager
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { observable } from 'mobx';
import { observer } from 'mobx-react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import withStyles from '@material-ui/core/styles/withStyles';

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

  static async dismiss(key, flag) {
    const alertInfo = this.queue.get(key);
    if (alertInfo.onDismiss) {
      await alertInfo.onDismiss(flag);
    }
    this.queue.delete(key);
  }

  get dialogs() {
    const dialogs = [];
    AlertManager.queue.forEach((alertInfo, key) => {
      dialogs.push((
        <Dialog
          key={key}
          open
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{alertInfo.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {alertInfo.description}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {alertInfo.ALERT_TYPE === 'confirm' &&
              <Button onClick={() => { AlertManager.dismiss(key, false); }}>
                Cancel
              </Button>
            }
            <Button onClick={() => { AlertManager.dismiss(key, true); }} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      ));
    });
    return dialogs;
  }

  render() {
    return (
      <React.Fragment>
        {this.dialogs}
      </React.Fragment>
    );
  }
}

AlertManager.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles({

})(observer(AlertManager));
