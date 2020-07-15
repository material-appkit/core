import PropTypes from 'prop-types';
import React, { Fragment, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
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
  dialogContent: theme.editDialog.dialogContent,

  deleteButton: {
    color: theme.palette.error.main,
  },
}));

function EditDialog(props) {
  const formRef = useRef(null);
  const [saving, setSaving] = useState(false);

  let title = null;
  if (props.title) {
    title = props.title;
  } else {
    title = props.entityType;
    if (props.persistedObject || props.apiDetailUrl) {
      title = `${props.labels.UPDATE} ${title}`;
    } else {
      title = `${props.labels.ADD} ${title}`;
    }
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


  const handleFormLoad = (representedObject, fieldInfoMap) => {
    if (props.onLoad) {
      props.onLoad(representedObject, fieldInfoMap);
    }
  };

  const handleFormWillSave = () => {
    setSaving(true);
  };

  const handleFormSave = (representedObject, response) => {
    setSaving(false);

    if (props.onSave) {
      props.onSave(representedObject, response);
    }

    dismiss();
  };

  const handleFormError = (err) => {
    setSaving(false);

    let errorMessage = props.labels.SAVE_FAIL_NOTIFICATION;

    const errors = err.response ? err.response.jsonData : {};
    Object.keys(errors).forEach((errorKey) => {
      const errorValue = errors[errorKey];
      if (props.labels[errorValue]) {
        errorMessage = props.labels[errorValue];
      }
    });

    SnackbarManager.error(errorMessage);

    if (props.onError) {
      props.onError(err);
    }
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Intercept the "Enter" key in order to prevent the dialog form
      // (as well as any underlying forms) from being automatically
      // submitted.
      e.preventDefault();
      e.stopPropagation();

      // Explicitly submit our own form
      formRef.current.save();
    }
  };


  const {
    FormProps,
    onSave,
    ...rest
  } = props;

  const classes = styles();

  return (
    <Dialog
      classes={{ paper: classes.paper }}
      onClose={() => { dismiss(); }}
      onKeyDown={handleKeyDown}
      open
    >
      <DialogTitle>
        {title}
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <Form
          ref={formRef}
          onLoad={handleFormLoad}
          onWillSave={handleFormWillSave}
          onSave={handleFormSave}
          onError={handleFormError}
          {...FormProps}
          {...rest}
        />
      </DialogContent>

      <DialogActions>
        {(props.persistedObject && props.canDelete) &&
          <Button
            className={classes.deleteButton}
            onClick={handleDeleteButtonClick}
          >
            {props.labels.DELETE}
          </Button>
        }

        <Spacer />

        <Button onClick={() => { dismiss(); }}>
          {props.labels.CANCEL}
        </Button>

        <Button
          color="primary"
          disabled={saving}
          onClick={() => { formRef.current.save(); }}
        >
          {saving ? props.labels.SAVING : props.labels.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditDialog.propTypes = {
  apiDetailUrl: PropTypes.string,
  canDelete: PropTypes.bool,
  entityType: PropTypes.string,
  FormProps: PropTypes.object,
  labels: PropTypes.object,
  onDelete: PropTypes.func,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
  onSave: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  persistedObject: PropTypes.object,
  title: PropTypes.string,
};

EditDialog.defaultProps = {
  canDelete: true,
  FormProps: {},
  labels: {
    ADD: 'Add',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    E_CREATE_DUPLICATE_RECORD: 'Refused to create duplicate record',
    SAVE: 'Save',
    SAVING: 'Saving...',
    SAVE_FAIL_NOTIFICATION: 'Unable to Save',
    UPDATE: 'Update',
  },
};

export default EditDialog;
