import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

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
    endpoint,
    errors,
    representedObject,
    onDelete,
    onDismiss,
    onError,
  } = props;

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});


  useEffect(() => {
    setFieldErrors(errors || {});
  }, [errors]);


  const handleFormChange = (e) => {
    const fieldName = e.target.name;
    setFieldErrors({ ...fieldErrors, [fieldName]: null });
  };


  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = formToObject(e.target);

    if (endpoint) {
      setLoading(true);
      const requestMethod = representedObject ? 'PATCH' : 'POST';
      ServiceAgent.request(requestMethod, endpoint, formData)
        .then((res) => {
          onDismiss(res.jsonData);
        })
        .catch((err) => {
          setLoading(false);

          if (onError) {
            onError(err);
          }
        });
    } else {
      onDismiss(formData);
    }
  };


  const handleDeleteButtonClick = async() => {
    setLoading(true);
    onDelete().then(() => {
      onDismiss(null);
    }).catch((err) => {
      setLoading(false);

      if (onError) {
        onError(err);
      }
    });
  };


  let leftActionControl  = null;
  if (loading) {
    leftActionControl = (
      <div className={classes.leftActionControl}>
        <CircularProgress size={20} />
        <Typography className={classes.activityLabel} variant="subtitle2">
          {props.activityLabel}
        </Typography>
      </div>
    );
  } else if (props.onDelete) {
    leftActionControl = (
      <Button
        className={classes.deleteButton}
        onClick={handleDeleteButtonClick}
      >
        {props.deleteButtonTitle}
      </Button>
    )
  }

  return (
    <Dialog
      open
      fullWidth
      maxWidth={props.maxWidth}
      PaperProps={{
        component: 'form',
        onChange: handleFormChange,
        onSubmit: handleFormSubmit,
      }}
    >
      <DialogTitle disableTypography>
        <Typography variant="h4">
          {props.title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {props.contentText &&
          <DialogContentText>
            {props.contentText}
          </DialogContentText>
        }

        {props.fieldArrangement.map((fieldInfo) => {
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

        <Button onClick={() => props.onDismiss(null)}>
          {props.cancelButtonTitle}
        </Button>

        <Button
          color="primary"
          disabled={loading}
          type="submit"
        >
          {props.commitButtonTitle}
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
  maxWidth: 'sm',
};

export default FormDialog;
