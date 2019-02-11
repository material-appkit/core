import PropTypes from 'prop-types';
import React from 'react';
import intl from 'react-intl-universal';
import { Redirect } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from '@material-ui/core/styles/withStyles';

import Form from './Form';
import FormActions from './FormActions';
import SnackbarManager from '../managers/SnackbarManager';
import ServiceAgent from '../util/ServiceAgent';

class EditDialog extends React.Component {
  constructor(props) {
    super(props);

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

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />;
    }

    const { classes } = this.props;
    return (
      <Dialog open
        classes={{ paper: classes.paper }}
        onClose={() => { this.dismiss(); }}
      >
        <DialogTitle id="form-dialog-title">{this.state.title}</DialogTitle>
        <DialogContent>
          <Form
            apiCreateUrl={this.props.apiCreateUrl}
            apiDetailUrl={this.props.apiDetailUrl}
            apiDetailUrlPath={this.props.apiDetailUrlPath}
            defaultValues={this.props.defaults}
            entityType={this.props.entityType}
            fields={this.props.fields}
            fieldArrangement={this.props.fieldArrangement}
            onLoad={this.handleFormLoad}
            onSave={this.handleFormSave}
            onError={this.handleFormError}
            representedObjectId={this.props.representedObjectId}
            serviceAgent={new this.props.ServiceAgent()}
          >
            <FormActions>
              <Button onClick={() => { this.dismiss(); }}>
                {intl.get('CANCEL').defaultMessage('Cancel')}
              </Button>
              <Button color="primary" type="submit">
                {intl.get('SAVE').defaultMessage('Save')}
              </Button>
            </FormActions>
          </Form>
        </DialogContent>
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
  fields: PropTypes.any,
  fieldArrangement: PropTypes.array,
  onLoad: PropTypes.func,
  onSave: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  representedObjectId: PropTypes.number,
  ServiceAgent: PropTypes.func,
  title: PropTypes.any,
  titleKey: PropTypes.string,
};

EditDialog.defaultProps = {
  defaults: {},
  ServiceAgent: ServiceAgent,
};


export default withStyles((theme) => ({
  paper: theme.editDialog.paper,
}))(EditDialog);
