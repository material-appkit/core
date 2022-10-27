import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Spacer from './Spacer';

import ServiceAgent from '../util/ServiceAgent';
import { formToObject } from '../util/form';
import { titleCase } from '../util/string';

const styles = makeStyles((theme) => ({
  dialogTitleRoot: {
    fontSize: theme.typography.pxToRem(18),
  },

  leftActionControl: {
    alignItems: 'center',
    display: 'flex',
    paddingLeft: theme.spacing(1),
  },

  activityLabel: {
    marginLeft: theme.spacing(1),
  },

  deleteButton: {
    color: theme.palette.error.main,
  },
}));

function FormDialog(props) {
  const classes = styles();

  const {
    activityLabel,
    cancelButtonTitle,
    commitButtonTitle,
    contentText,
    deleteButtonTitle,
    endpoint,
    errors,
    extraFormData,
    fieldArrangement,
    maxWidth,
    representedObject,
    onDelete,
    onDismiss,
    onError,
    title,
  } = props;

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});


  useEffect(() => {
    setFieldErrors(errors || {});
  }, [errors]);


  const handleFormChange = useCallback((e) => {
    const fieldName = e.target.name;
    setFieldErrors({ ...fieldErrors, [fieldName]: null });
  }, []);


  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();

    const formData = Object.assign({}, formToObject(e.target), extraFormData);

    if (endpoint) {
      setLoading(true);
      setFieldErrors({});

      const requestMethod = representedObject ? 'PATCH' : 'POST';
      ServiceAgent.request(requestMethod, endpoint, formData)
        .then((res) => {
          onDismiss(res.jsonData);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response && err.response.jsonData) {
            setFieldErrors(err.response.jsonData);
          }

          if (onError) {
            onError(err);
          }
        });
    } else {
      onDismiss(formData);
    }
  }, [endpoint, onDismiss, onError, representedObject]);


  const handleDeleteButtonClick = useCallback(() => {
    setLoading(true);
    onDelete().then(() => {
      onDismiss(null);
    }).catch((err) => {
      if (onError) {
        onError(err);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, [onDelete, onError]);


  let leftActionControl  = null;
  if (loading) {
    leftActionControl = (
      <div className={classes.leftActionControl}>
        <CircularProgress size={20} />
        <Typography className={classes.activityLabel} variant="subtitle2">
          {activityLabel}
        </Typography>
      </div>
    );
  } else if (onDelete) {
    leftActionControl = (
      <Button
        className={classes.deleteButton}
        onClick={handleDeleteButtonClick}
      >
        {deleteButtonTitle}
      </Button>
    )
  }

  return (
    <Dialog
      open
      fullWidth
      maxWidth={maxWidth}
      PaperProps={{
        component: 'form',
        onChange: handleFormChange,
        onSubmit: handleFormSubmit,
      }}
    >
      <DialogTitle disableTypography>
        <Typography variant="h4">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {contentText &&
          <DialogContentText>
            {contentText}
          </DialogContentText>
        }

        {fieldArrangement.map((fieldInfo) => {
          let textFieldProps = fieldInfo;
          if (typeof(fieldInfo) === 'string') {
            textFieldProps = {
              name: fieldInfo,
              type: 'text',
            }
          }

          const fieldName = textFieldProps.name;
          if (!textFieldProps.label) {
            textFieldProps.label = titleCase(fieldName);
          }

          if (representedObject) {
            textFieldProps.defaultValue = representedObject[fieldName];
          }

          return (
            <TextField
              error={Boolean(fieldErrors[fieldName])}
              helperText={fieldErrors[fieldName]}
              fullWidth
              key={fieldName}
              margin="dense"
              {...textFieldProps}
            />
          );
        })}
      </DialogContent>

      <DialogActions>
        {leftActionControl}

        <Spacer />

        <Button onClick={() => onDismiss(null)}>
          {cancelButtonTitle}
        </Button>

        <Button
          color="primary"
          disabled={loading}
          type="submit"
        >
          {commitButtonTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FormDialog.propTypes = {
  activityLabel: PropTypes.string,
  cancelButtonTitle: PropTypes.string,
  commitButtonTitle: PropTypes.string,
  contentText: PropTypes.string,
  errors: PropTypes.object,
  extraFormData: PropTypes.object,
  onDelete: PropTypes.func,
  fieldArrangement: PropTypes.array.isRequired,
  endpoint: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
  onError: PropTypes.func,
  maxWidth: PropTypes.string,
  representedObject: PropTypes.object,
  title: PropTypes.string,
};

FormDialog.defaultProps = {
  activityLabel: 'Working...',
  cancelButtonTitle: 'Cancel',
  commitButtonTitle: 'Save',
  deleteButtonTitle: 'Delete',
  extraFormData: {},
  maxWidth: 'sm',
};

export default FormDialog;
