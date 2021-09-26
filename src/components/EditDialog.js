import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import AlertManager from '../managers/AlertManager';
import SnackbarManager from '../managers/SnackbarManager';
import ServiceAgent from '../util/ServiceAgent';

import Form from './Form';
import Spacer from './Spacer';

const styles = makeStyles((theme) => ({
  paper: {
    minWidth: 320,
    width: 480,
    overflow: 'visible',
  },

  dialogTitle: {
    margin: 0,
  },

  dialogTitleHeading: {
    fontSize: theme.typography.pxToRem(18),
  },

  dialogContent: {
    overflow: 'visible',
  },

  deleteButton: {
    color: theme.palette.error.main,
  },
}));

function EditDialog(props) {
  const classes = styles();

  const {
    canDelete,
    commitOnEnter,
    FormProps,
    entityType,
    labels,
    onClose,
    onDelete,
    onError,
    onLoad,
    onSave,
    persistedObject,
    ...rest
  } = props;

  const formRef = useRef(null);
  const [saving, setSaving] = useState(false);

  let detailUrl = rest.apiDetailUrl;
  if (persistedObject && persistedObject.url) {
    detailUrl = persistedObject.url;
  }

  let title = null;
  if (props.title) {
    title = props.title;
  } else {
    title = entityType;
    if (detailUrl) {
      title = `${labels.UPDATE} ${title}`;
    } else {
      title = `${labels.ADD} ${title}`;
    }
  }

  const dismiss = useCallback(() => {
    onClose(this);
  }, [onClose]);


  const deleteRepresentedObject = async() => {
    await ServiceAgent.delete(detailUrl);

    if (onDelete) {
      onDelete(persistedObject);
    }

    dismiss();
  };



  const handleFormLoad = (representedObject, fieldInfoMap) => {
    if (onLoad) {
      onLoad(representedObject, fieldInfoMap);
    }
  };

  const handleFormWillSave = () => {
    setSaving(true);
  };

  const handleFormSave = (representedObject, response) => {
    setSaving(false);

    if (onSave) {
      onSave(representedObject, response);
    }

    dismiss();
  };

  const handleFormError = (err) => {
    setSaving(false);

    let errorMessage = labels.SAVE_FAIL_NOTIFICATION;

    const errors = err.response ? err.response.jsonData : {};
    Object.keys(errors).forEach((errorKey) => {
      const errorValue = errors[errorKey];
      if (labels[errorValue]) {
        errorMessage = labels[errorValue];
      }
    });

    SnackbarManager.error(errorMessage);

    if (onError) {
      onError(err);
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

  const handleKeyUp = useCallback((e) => {
    if (e.key === 'Enter') {
      // Intercept the "Enter" key in order to prevent the dialog form
      // (as well as any underlying forms) from being automatically
      // submitted.
      e.preventDefault();
      e.stopPropagation();

      // Explicitly submit our own form
      formRef.current.save();
    }
  }, []);

  const handleDialogClose = useCallback((e, reason) => {
    if (reason === 'escapeKeyDown') {
      dismiss();
    }
  }, []);

  return (
    <Dialog
      classes={{ paper: classes.paper }}
      onClose={handleDialogClose}
      onKeyUp={commitOnEnter ? handleKeyUp : null}
      open
    >
      <DialogTitle className={classes.dialogTitle} disableTypography>
        <Typography className={classes.dialogTitleHeading}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent className={classes.dialogContent} dividers>
        <Form
          ref={formRef}
          onLoad={handleFormLoad}
          onWillSave={handleFormWillSave}
          onSave={handleFormSave}
          onError={handleFormError}
          persistedObject={persistedObject}
          {...FormProps}
          {...rest}
        />
      </DialogContent>

      <DialogActions>
        {(detailUrl && canDelete) &&
          <Button
            className={classes.deleteButton}
            onClick={handleDeleteButtonClick}
          >
            {labels.DELETE}
          </Button>
        }

        <Spacer />

        <Button onClick={() => dismiss()}>
          {labels.CANCEL}
        </Button>

        <Button
          color="primary"
          disabled={saving}
          onClick={() => formRef.current.save()}
        >
          {saving ? labels.SAVING : labels.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditDialog.propTypes = {
  apiCreateUrl: PropTypes.string,
  apiDetailUrl: PropTypes.string,
  canDelete: PropTypes.bool,
  commitOnEnter: PropTypes.bool,
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
  commitOnEnter: true,
  FormProps: {},
  labels: {
    ADD: 'Add',
    CANCEL: 'Cancel',
    DELETE: 'Delete',
    E_CREATE_DUPLICATE_RECORD: 'Refused to create duplicate record',
    SAVE: 'Save',
    SAVING: 'Saving...',
    SAVE_FAIL_NOTIFICATION: 'Unable to save',
    UPDATE: 'Update',
  },
};

export default EditDialog;
