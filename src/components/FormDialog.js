import PropTypes from 'prop-types';
import React, { useState } from 'react';

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

import ServiceAgent from '../util/ServiceAgent';
import { formToObject } from '../util/form';
import { titleCase } from '../util/string';

const styles = makeStyles((theme) => ({
  activityIndicatorContainer: {
    alignItems: 'center',
    display: 'flex',
    marginLeft: theme.spacing(2),
    marginRight: 'auto',
  },

  activityLabel: {
    marginLeft: 8,
  }
}));

function FormDialog(props) {
  const classes = styles();
  const { representedObject } = props;

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = formToObject(e.target);
    const requestMethod = representedObject ? 'PATCH' : 'POST';
    ServiceAgent.request(requestMethod, props.endpoint, formData)
      .then((res) => {
        props.onDismiss(res.body);
      })
      .catch((err) => {
        setLoading(false);

        if (props.onError) {
          props.onError(err);
        }
      })
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
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
        <DialogContentText>
          {props.contentText}
        </DialogContentText>

        {props.fieldArrangement.map((fieldInfo) => {
          let textFieldProps = fieldInfo;
          if (typeof(fieldInfo) === 'string') {
            textFieldProps = {
              name: fieldInfo,
              type: 'text',
              label: titleCase(fieldInfo),
            }
          }

          const fieldName = textFieldProps.name;

          if (representedObject) {
            textFieldProps.defaultValue = representedObject[fieldName];
          }

          return (
            <TextField
              key={fieldName}
              fullWidth
              {...textFieldProps}
            />
          );
        })}
      </DialogContent>

      <DialogActions>
        {loading &&
        <div className={classes.activityIndicatorContainer}>
          <CircularProgress size={20} />
          <Typography className={classes.activityLabel} variant="subtitle2">
            {props.activityLabel}
          </Typography>
        </div>
        }

        <Button onClick={() => { props.onDismiss(null); }}>
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
  fieldArrangement: PropTypes.array.isRequired,
  endpoint: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onError: PropTypes.func,
  representedObject: PropTypes.object,
  title: PropTypes.string,
};

FormDialog.defaultProps = {
  activityLabel: 'Working...',
  cancelButtonTitle: 'Cancel',
  commitButtonTitle: 'Done',
};

export default FormDialog;
