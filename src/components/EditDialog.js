import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from '@material-ui/core/styles/withStyles';

import AlertManager from '../managers/AlertManager';
import SnackbarManager from '../managers/SnackbarManager';
import ServiceAgent from '../util/ServiceAgent';

import Form from './Form';
import Spacer from './Spacer';

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

  handleDeleteButtonClick = () => {
    AlertManager.confirm({
      title: `Please Confirm`,
      description: 'Are you sure you want to delete this item?',
      confirmButtonTitle: 'Delete',
      onDismiss: (flag) => {
        if (flag) {
          this.deleteRepresentedObject();
        }
      },
    });
  };

  deleteRepresentedObject = async() => {
    const { persistedObject } = this.props;
    await ServiceAgent.delete(persistedObject.url);

    if (this.props.onDelete) {
      this.props.onDelete(persistedObject);
    }

    this.dismiss();
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

    const {
      persistedObject,
      classes,
      FormProps,
      ...rest
    } = this.props;

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
        <div className={classes.dialogActions}>
          {persistedObject &&
            <Fragment>
              <Button
                className={classes.deleteButton}
                onClick={this.handleDeleteButtonClick}
              >
                {this.props.labels.DELETE}
              </Button>
              <Spacer />
            </Fragment>
          }
          <Button onClick={() => { this.dismiss(); }}>
            {this.props.labels.CANCEL}
          </Button>
          <Button onClick={() => { this.commit(); }} color="primary">
            {this.props.labels.SAVE}
          </Button>
        </div>
      </Dialog>
    );
  }
}

EditDialog.propTypes = {
  apiDetailUrl: PropTypes.string,
  classes: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  FormProps: PropTypes.object,
  labels: PropTypes.object,
  persistedObject: PropTypes.object,
  onDelete: PropTypes.func,
  onLoad: PropTypes.func,
  onSave: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

EditDialog.defaultProps = {
  FormProps: {},
  labels: {
    ADD: 'Add',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    SAVE: 'Save',
    SAVE_FAIL_NOTIFICATION: 'Unable to Save',
    UPDATE: 'Update',
  },
};

export default withStyles((theme) => ({
  paper: theme.editDialog.paper,

  dialogActions: {
    flex: '0 0 auto',
    margin: '8px 4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  deleteButton: {
    color: '#f93d3d',
  },
}))(EditDialog);
