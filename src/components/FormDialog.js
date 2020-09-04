import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Box from '@material-ui/core/Box';
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
  activityLabel: {
    marginLeft: 8,
  },

  deleteButton: {
    color: theme.palette.error.main,
  },
}));

function FormDialog(props) {
  const classes = styles();
  const { endpoint, representedObject } = props;

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = formToObject(e.target);

    if (endpoint) {
      setLoading(true);
      const requestMethod = representedObject ? 'PATCH' : 'POST';
      ServiceAgent.request(requestMethod, endpoint, formData)
        .then((res) => {
          props.onDismiss(res.jsonData);
        })
        .catch((err) => {
          setLoading(false);

          if (props.onError) {
            props.onError(err);
          }
        });
    } else {
      props.onDismiss(formData);
    }
  };

  const handleDeleteButtonClick = async() => {
    setLoading(true);
    props.onDelete().then(() => {
      props.onDismiss(null);
    }).catch((err) => {
      setLoading(false);

      if (props.onError) {
        props.onError(err);
      }
    });
  };

  let leftActionControl  = null;
  if (loading) {
    leftActionControl = (
      <Box display="flex" alignItems="center" paddingLeft={1}>
        <CircularProgress size={20} />
        <Typography className={classes.activityLabel} variant="subtitle2">
          {props.activityLabel}
        </Typography>
      </Box>
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
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      maxWidth={props.maxWidth}
      PaperProps={{
        component: 'form',
        onSubmit: handleFormSubmit,
      }}
      open
      onClose={() => { props.onDismiss(null); }}
    >
      <DialogTitle>
        {props.title}
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
              label: titleCase(fieldInfo),
              name: fieldInfo,
              type: 'text',
            }
          }

          const fieldName = textFieldProps.name;

          if (representedObject) {
            textFieldProps.defaultValue = representedObject[fieldName];
          }

          return (
            <TextField
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
