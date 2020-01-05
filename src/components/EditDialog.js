import PropTypes from 'prop-types';
import React, { Fragment, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

import AlertManager from '../managers/AlertManager';
import SnackbarManager from '../managers/SnackbarManager';
import ServiceAgent from '../util/ServiceAgent';

import Form from './Form';
import Spacer from './Spacer';

const styles = makeStyles((theme) => ({
  paper: theme.editDialog.paper,

  dialogActions: {
    flex: '0 0 auto',
    margin: '8px 4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  deleteButton: {
    color: theme.palette.error.main,
  },
}));

function EditDialog(props) {
    const formRef = useRef(null);


    let title = props.entityType;
    if (props.persistedObject || props.apiDetailUrl || props.representedObjectId) {
      title = `${props.labels.UPDATE} ${title}`;
    } else {
      title = `${props.labels.ADD} ${title}`;
    }




  const deleteRepresentedObject = async() => {
    const { persistedObject } = props;
    await ServiceAgent.delete(persistedObject.url);

    if (props.onDelete) {
      props.onDelete(persistedObject);
    }

    dismiss();
  };

  const dismiss = () => {
    props.onClose(this);
  };

  const commit = () => {
    formRef.current.save();
  };

  const handleFormLoad = (representedObject, fieldInfoMap) => {
    if (props.onLoad) {
      props.onLoad(representedObject, fieldInfoMap);
    }
  };

  const handleFormSave = (representedObject) => {
    if (props.onSave) {
      props.onSave(representedObject);
    }

    dismiss();
  };

  const handleFormError = () => {
    const errorMessage = props.labels.SAVE_FAIL_NOTIFICATION;
    SnackbarManager.error(errorMessage);
  };


  const handleDeleteButtonClick = () => {
    AlertManager.confirm({
      title: `Please Confirm`,
      description: 'Are you sure you want to delete this item?',
      confirmButtonTitle: 'Delete',
      onDismiss: (flag) => {
        if (flag) {
          deleteRepresentedObject();
        }
      },
    });
  };

  const {
    onSave,
    FormProps,
    ...rest
  } = props;

  const classes = styles();

  return (
    <Dialog
      classes={{ paper: classes.paper }}
      onClose={() => { dismiss(); }}
      open
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Form
          ref={formRef}
          onLoad={handleFormLoad}
          onSave={handleFormSave}
          onError={handleFormError}
          {...FormProps}
          {...rest}
        />
      </DialogContent>
      <div className={classes.dialogActions}>
        {(props.persistedObject && props.canDelete) &&
          <Fragment>
            <Button
              className={classes.deleteButton}
              onClick={handleDeleteButtonClick}
            >
              {props.labels.DELETE}
            </Button>
            <Spacer />
          </Fragment>
        }
        <Button onClick={() => { dismiss(); }}>
          {props.labels.CANCEL}
        </Button>
        <Button onClick={() => { commit(); }} color="primary">
          {props.labels.SAVE}
        </Button>
      </div>
    </Dialog>
  );

}

EditDialog.propTypes = {
  apiDetailUrl: PropTypes.string,
  canDelete: PropTypes.bool,
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
  canDelete: true,
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

export default EditDialog;
