import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

import Form from './Form';

const fromRepresentation = (value, fieldInfo) => {
  if (fieldInfo.type === 'checkbox') {
    switch (value) {
      case true:
      case 'true':
      case 'True':
        return 'true';
      case false:
      case 'false':
      case 'False':
      case '':
        return 'false';
      default:
        break;
    }
  }
  return value;
};

export const toRepresentation = (value, fieldInfo) => {
  const { widget } = fieldInfo.ui || {};
  const WidgetClass = Form.widgetClassForType(widget);
  if (WidgetClass && WidgetClass.hasOwnProperty('toRepresentation')) {
    return WidgetClass.toRepresentation(value);
  }

  switch (fieldInfo.type) {
    case 'date':
    case 'datetime':
      return (value === '') ? null : value;
    case 'number':
      return (value === '') ? null : parseFloat(value);
    default:
      return value;
  }
};

/**
 * Given a field's metadata description, construct a component widget
 * @param fieldInfo
 */

function FormField(props) {
  const {
    classes,
    errorText,
    fieldArrangementInfo,
    fieldInfo,
    form,
    onChange,
  } = props;

  const { formData } = form.state;

  const fieldName = fieldInfo.key;
  const fieldValue = fromRepresentation(formData[fieldName], fieldInfo);

  const { autoFocus, help, label, widget } = fieldInfo.ui;

  const commonFieldProps = {
    value: fieldValue,
    name: fieldName,
  };

  if (fieldInfo.hidden || widget === 'hidden') {
    return <input type="hidden" {...commonFieldProps} />;
  }

  Object.assign(commonFieldProps, {
    autoFocus,
    error: errorText ? true : false,
    helperText: errorText || help,
    label,
  });

  //----------------------------------------------------------------------------
  const handleFieldChange = (value) => {
    form.setValue(fieldName, value);
    onChange(value, fieldInfo);
  };

  let WidgetComponent = fieldArrangementInfo.widget;
  if (!WidgetComponent) {
    WidgetComponent = form.constructor.widgetClassForType(widget);
  }
  if (WidgetComponent) {
    // If a widget component has been been specified, use it
    return (
      <WidgetComponent
        fieldInfo={fieldInfo}
        onChange={(value) => { handleFieldChange(value); }}
        {...commonFieldProps}
        {...fieldArrangementInfo}
      />
    );
  }

  const textFieldProps = {
    ...commonFieldProps,
    fullWidth: true,
    InputLabelProps: { classes: { root: classes.inputLabel } },
    margin: "normal",
    onChange: (e) => { handleFieldChange(e.target.value); },
    type: fieldInfo.type,
    variant: "outlined",
  };

  if (fieldInfo.choices) {
    textFieldProps.select = true;
    textFieldProps.SelectProps = { native: true };
  }

  if (widget === 'textarea') {
    textFieldProps.multiline = true;
    textFieldProps.rows = 2;
    textFieldProps.rowsMax = 20;
  }

  if (fieldInfo.type === 'number') {
    // Let numbers be input in any form
    textFieldProps.inputProps = { min: 0, step: 'any' };
  }

  if (fieldInfo.type === 'checkbox') {
    // Let boolean fields be rendered as a select element
    // with Yes/No as choices.
    textFieldProps.select = true;
    textFieldProps.SelectProps = { native: true };
    fieldInfo.choices = [
      { 'label': 'Yes', value: 'true' },
      { 'label': 'No', value: 'false' },
    ]
  }

  return (
    <TextField {...textFieldProps }>
      {fieldInfo.choices &&
        <Fragment>
          <option />
          {fieldInfo.choices.map((choice) => (
            <option key={choice.value} value={choice.value}>{choice.label}</option>
          ))}
        </Fragment>
      }
    </TextField>
  );
}

FormField.propTypes = {
  classes: PropTypes.object,
  errorText: PropTypes.any,
  fieldArrangementInfo: PropTypes.object.isRequired,
  fieldInfo: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles((theme) => {
  return theme.form;
})(FormField);

