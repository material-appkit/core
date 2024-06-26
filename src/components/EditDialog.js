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
import NotificationManager from '../managers/NotificationManager';
import SnackbarManager from '../managers/SnackbarManager';
import ServiceAgent from '../util/ServiceAgent';

import Form from './Form';
import Spacer from './Spacer';

const DEFAULT_LABELS = {
  ADD: 'Add',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  E_CREATE_DUPLICATE_RECORD: 'Refused to create duplicate record',
  SAVE: 'Save',
  SAVING: 'Saving...',
  SAVE_FAIL_NOTIFICATION: 'Unable to save',
  UPDATE: 'Update',
}


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
    padding: theme.spacing(1, 1),

    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1, 2),
    },
  },

  deleteButton: {
    color: theme.palette.error.main,
  },
}));


function EditDialog(props) {
  const classes = styles();

  const {
    canDelete,
    FormProps,
    dismiss,
    entityType,
    labels,
    onClose,
    onDelete,
    onError,
    onLoad,
    onSave,
    persistedObject,
    ...extraFormProps
  } = props;

  const formRef = useRef(null);
  const [saving, setSaving] = useState(false);

  const composedLabels = {
    ...DEFAULT_LABELS,
    ...(labels || {})
  };

  let detailUrl = extraFormProps.apiDetailUrl;
  if (persistedObject && persistedObject.url) {
    detailUrl = persistedObject.url;
  }

  let title;
  if (props.title) {
    title = props.title;
  } else {
    title = entityType;
    if (detailUrl) {
      title = `${composedLabels.UPDATE} ${title}`;
    } else {
      title = `${composedLabels.ADD} ${title}`;
    }
  }

  const dismissDialog = useCallback((value = null) => {
    if (dismiss) {
      dismiss(value);
    } else if (onClose) {
      onClose(value);
    } else {
      throw new Error('EditDialog requires prop "dismiss" or "onClose"');
    }
  }, [dismiss, onClose]);


  const deleteRepresentedObject = async() => {
    await ServiceAgent.delete(detailUrl);

    if (onDelete) {
      onDelete(persistedObject);
    }

    dismissDialog();
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

    NotificationManager.postNotification('recordDidSave', null, {
      operation: detailUrl ? 'update' : 'create',
      preUpdate: persistedObject,
      postUpdate: representedObject,
    });

    if (onSave) {
      onSave(representedObject, response);
    }

    dismissDialog(representedObject);
  };

  const handleFormError = (err) => {
    setSaving(false);

    let errorMessage = composedLabels.SAVE_FAIL_NOTIFICATION;

    const errors = err.response ? err.response.jsonData : {};
    Object.keys(errors).forEach((errorKey) => {
      const errorValue = errors[errorKey];
      if (composedLabels[errorValue]) {
        errorMessage = composedLabels[errorValue];
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
    }, 'warn');
  };


  const handleDialogClose = useCallback((e, reason) => {
    if (reason === 'escapeKeyDown') {
      dismissDialog();
    }
  }, []);

  let commitButtonLabel;
  if (saving) {
    commitButtonLabel = composedLabels.SAVING;
  } else {
    commitButtonLabel = persistedObject ? composedLabels.SAVE : composedLabels.ADD;
  }

  return (
    <Dialog
      classes={{ paper: classes.paper }}
      onClose={handleDialogClose}
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
          {...extraFormProps}
        />
      </DialogContent>

      <DialogActions>
        {(detailUrl && canDelete) &&
          <Button
            className={classes.deleteButton}
            onClick={handleDeleteButtonClick}
          >
            {composedLabels.DELETE}
          </Button>
        }

        <Spacer />

        <Button onClick={() => dismissDialog()}>
          {composedLabels.CANCEL}
        </Button>

        <Button
          color="primary"
          disabled={saving}
          onClick={() => formRef.current.save()}
          variant="contained"
        >
          {commitButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditDialog.propTypes = {
  apiCreateUrl: PropTypes.string,
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
  canDelete: false,
  FormProps: {},
};

export default EditDialog;
