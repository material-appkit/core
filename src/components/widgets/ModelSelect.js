/**
*
* ModelSelectWidget
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import withStyles from '@material-ui/core/styles/withStyles';

import PagedListViewDialog from '../PagedListViewDialog';


class ModelSelectWidget extends React.PureComponent {
  static toRepresentation(value) {
    return value.url;
  }

  constructor(props) {
    super(props);

    this.state = {
      listDialogOpen: false,
      selectedModel: props.value,
      buttonLabel: ''
    };
  }

  get buttonLabel() {
    const { selectedModel } = this.state;
    const { listDialogProps, titleKey } = this.props;

    if (selectedModel) {
      if (typeof(titleKey) === 'function') {
        return titleKey(selectedModel);
      }
      return selectedModel[titleKey];
    } else {
      return `Choose ${listDialogProps.entityType || 'Option'}...`;
    }
  }

  handleListDialogDismiss = (selection) => {
    const newState = { listDialogOpen: false };
    if (selection) {
      newState.selectedModel = selection;

      if (this.props.onChange) {
        this.props.onChange(selection);
      }
    }
    this.setState(newState);
  };

  render() {
    const {
      classes,
      fieldInfo,
      label,
      listDialogProps,
    } = this.props;

    const apiListUrl = `${fieldInfo.related_endpoint.singular}/`;

    return (
      <FormControl fullWidth margin="dense">
        <fieldset className={classes.fieldset}>
          {label &&
            <legend className={classes.legend}>{label}</legend>
          }
          <Button
            color="primary"
            onClick={() => { this.setState({ listDialogOpen: true }); }}
          >
            {this.buttonLabel}
          </Button>
        </fieldset>

        {this.state.listDialogOpen &&
          <PagedListViewDialog {...listDialogProps}
            onDismiss={this.handleListDialogDismiss}
            selectionMode="single"
            src={apiListUrl}
          />
        }
      </FormControl>
    );
  }
}

ModelSelectWidget.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string,
  listDialogProps: PropTypes.object,
  titleKey: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  value: PropTypes.any,
};

ModelSelectWidget.defaultProps = {
  listDialogProps: {},
};

export default withStyles((theme) => ({
  fieldset: theme.form.customControl.fieldset,
  legend: theme.form.customControl.legend,
}))(ModelSelectWidget);
