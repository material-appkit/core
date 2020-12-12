/**
*
* ModelSelect
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

import PagedListViewDialog from '../PagedListViewDialog';


class ModelSelectWidget extends React.PureComponent {
  static toRepresentation(value) {
    return value ? value.url : null;
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

  get selectedModel() {
    return this.state.selectedModel;
  }

  set selectedModel(value) {
    this.setState({ selectedModel: value });

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }


  handleClearButtonClick = () => {
    this.selectedModel = null;
  };

  handleListDialogDismiss = (selection) => {
    const newState = { listDialogOpen: false };

    if (selection && selection.length) {
      this.selectedModel = selection[0];
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
      <FormControl fullWidth margin="none">
        <fieldset className={classes.fieldset}>
          {label &&
            <legend className={classes.legend}>{label}</legend>
          }
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Button
              color="primary"
              className={classes.button}
              onClick={() => { this.setState({ listDialogOpen: true }); }}
              size="small"
            >
              {this.buttonLabel}
            </Button>

            {this.selectedModel &&
              <IconButton
                className={classes.clearButton}
                onClick={() => { this.selectedModel = null; }}
              >
                <CloseIcon />
              </IconButton>
            }
          </Box>
        </fieldset>

        {this.state.listDialogOpen &&
          <PagedListViewDialog {...listDialogProps}
            apiCreateUrl={apiListUrl}
            onDismiss={this.handleListDialogDismiss}
            selectionMode="single"
            src={apiListUrl}
            title={`Select ${fieldInfo.ui.label}`}
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
  button: {
    minWidth: 'initial',
  },
  clearButton: {
    padding: 6,
  }
}))(ModelSelectWidget);
