import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from '@material-ui/core/styles/withStyles';

import Form from './Form';
import FormActions from './FormActions';
import SnackbarManager from '../managers/SnackbarManager';

class EditDialog extends React.Component {
  constructor(props) {
    super(props);

    this.formRef = React.createRef();

    let title = props.entityType;
    if (props.apiDetailUrl || props.representedObjectId) {
      title = `${this.props.labels.UPDATE} ${title}`;
    } else {
      title = `${this.props.labels.ADD} ${title}`;
    }

    this.state = {
      title,
      redirectTo: null,
    };
  }

  handleFormLoad = (representedObject, fieldInfoMap) => {
    if (this.props.onLoad) {
      this.props.onLoad(representedObject, fieldInfoMap);
    }
  };

  handleFormSave = (representedObject) => {
    if (this.props.onSave) {
      this.props.onSave(representedObject);
    }

    this.dismiss();
  };

  handleFormError = (err) => {
    const errorMessage = this.props.labels.SAVE_FAIL_NOTIFICATION;
    SnackbarManager.error(errorMessage);
  };

  dismiss() {
    this.props.onClose(this);
  }

  commit() {
    this.formRef.current.save();
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    const { classes, FormProps, ...rest } = this.props;
    return (
      <Dialog open
        classes={{ paper: classes.paper }}
        onClose={() => { this.dismiss(); }}
      >
        <DialogTitle id="form-dialog-title">{this.state.title}</DialogTitle>
        <DialogContent>
          <Form
            innerRef={this.formRef}
            onLoad={this.handleFormLoad}
            onSave={this.handleFormSave}
            onError={this.handleFormError}
            {...FormProps}
            {...rest}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { this.dismiss(); }}>
            {this.props.labels.CANCEL}
          </Button>
          <Button onClick={() => { this.commit(); }} color="primary">
            {this.props.labels.SAVE}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

EditDialog.propTypes = {
  classes: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  FormProps: PropTypes.object,
  labels: PropTypes.object,
  onLoad: PropTypes.func,
  onSave: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

EditDialog.defaultProps = {
  defaults: {},
  FormProps: {},
  labels: {
    ADD: 'dd',
    CANCEL: 'Cancel',
    SAVE: 'Save',
    SAVE_FAIL_NOTIFICATION: 'Unable to Save',
    UPDATE: 'Update',
  },
};


export default withStyles((theme) => ({
  paper: theme.editDialog.paper,
}))(EditDialog);
