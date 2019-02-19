import PropTypes from 'prop-types';
import React from 'react';
import intl from 'react-intl-universal';
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
      title = `${intl.get('UPDATE').defaultMessage('Update')} ${title}`;
    } else {
      title = `${intl.get('ADD').defaultMessage('Add')} ${title}`;
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
    const errorMessage = intl.get('SAVE_FAIL_NOTIFICATION').defaultMessage('Unable to Save');
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

    const {
      apiCreateUrl,
      apiDetailUrl,
      apiDetailUrlPath,
      classes,
      defaults,
      entityType,
      FieldSet,
      fieldArrangement,
      representedObjectId,
    } = this.props;
    return (
      <Dialog open
        classes={{ paper: classes.paper }}
        onClose={() => { this.dismiss(); }}
      >
        <DialogTitle id="form-dialog-title">{this.state.title}</DialogTitle>
        <DialogContent>
          <Form
            apiCreateUrl={apiCreateUrl}
            apiDetailUrl={apiDetailUrl}
            apiDetailUrlPath={apiDetailUrlPath}
            defaultValues={defaults}
            entityType={entityType}
            innerRef={this.formRef}
            FieldSet={FieldSet}
            fieldArrangement={fieldArrangement}
            onLoad={this.handleFormLoad}
            onSave={this.handleFormSave}
            onError={this.handleFormError}
            representedObjectId={representedObjectId}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { this.dismiss(); }}>
            {intl.get('CANCEL').defaultMessage('Cancel')}
          </Button>
          <Button onClick={() => { this.commit(); }} color="primary">
            {intl.get('SAVE').defaultMessage('Save')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

EditDialog.propTypes = {
  apiCreateUrl: PropTypes.string,
  apiDetailUrl: PropTypes.string,
  apiDetailUrlPath: PropTypes.string,
  classes: PropTypes.object,
  defaults: PropTypes.object,
  entityType: PropTypes.string.isRequired,
  FieldSet: PropTypes.any,
  fieldArrangement: PropTypes.array,
  onLoad: PropTypes.func,
  onSave: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  representedObjectId: PropTypes.number,
  title: PropTypes.any,
  titleKey: PropTypes.string,
};

EditDialog.defaultProps = {
  defaults: {},
};


export default withStyles((theme) => ({
  paper: theme.editDialog.paper,
}))(EditDialog);
