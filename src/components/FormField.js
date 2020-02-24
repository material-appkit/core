/**
 * Given a field's metadata description, construct a component widget
 */

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import { isValue } from '../util/value';

//------------------------------------------------------------------------------
export const fromRepresentation = (value, fieldInfo) => {
  const { widget } = fieldInfo.ui || {};

  switch (widget) {
    case 'itemlist':
      return value || [];
    case 'select':
      if (!value) {
        return '';
      } else if (typeof(value) === 'object') {
        return value.url;
      } else {
        return value;
      }
    default:
      if (fieldInfo.type === 'checkbox') {
        switch (value) {
          case true:
          case 'true':
          case 'True':
            return (widget === 'switch')  ? true : 'true';
          case false:
          case undefined:
          case 'false':
          case 'False':
          case '':
            return (widget === 'switch')  ? false : 'false';
          default:
            throw new Error(`Invalid boolean value: ${value}`);
        }
      }

      return value || '';
  }
};

//------------------------------------------------------------------------------
export const toRepresentation = (value, fieldInfo, form) => {
  const { widget } = fieldInfo.ui || {};
  const WidgetClass = form.constructor.widgetClassForType(widget);
  if (WidgetClass && WidgetClass.hasOwnProperty('toRepresentation')) {
    return WidgetClass.toRepresentation(value);
  }

  let coercedValue = value;
  if (!isValue(coercedValue) && isValue(fieldInfo.default)) {
    coercedValue = fieldInfo.default;
  }

  switch (fieldInfo.type) {
    case 'date':
    case 'datetime':
      return (coercedValue === '') ? null : coercedValue;
    case 'number':
      return (coercedValue === '') ? null : parseFloat(coercedValue);
    default:
      return coercedValue;
  }
};


//------------------------------------------------------------------------------
function renderSwitchField(props, fieldInfo, onChange) {
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Switch
            checked={props.value}
            onChange={(e) => { onChange(e.target.checked); }}
          />
        }
        label={props.label}
      />
    </FormGroup>
  );
}

//------------------------------------------------------------------------------
const textFieldStyles = makeStyles((theme) => {
  return theme.form;
});

function renderTextField(props, fieldInfo, onChange) {
  const classes = textFieldStyles();

  const textFieldProps = {
    ...props,
    fullWidth: true,
    InputLabelProps: { classes: { root: classes.inputLabel } },
    margin: "normal",
    onChange: (e) => { onChange(e.target.value); },
    type: fieldInfo.type,
    variant: "outlined",
  };

  if (fieldInfo.choices) {
    textFieldProps.select = true;
    textFieldProps.SelectProps = { native: true };
  }

  if (fieldInfo.ui.widget === 'textarea') {
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

//------------------------------------------------------------------------------
function FormField(props) {
  const {
    errorText,
    fieldArrangementInfo,
    fieldInfo,
    form,
    onChange,
  } = props;

  const { autoFocus, help, label, widget } = fieldInfo.ui;
  const fieldName = fieldInfo.key;

  const { formData } = form.state;

  const commonFieldProps = {
    name: fieldName,
    value: formData[fieldName],
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

  switch (widget) {
    case 'switch':
      return renderSwitchField(commonFieldProps, fieldInfo, handleFieldChange);
    default:
    // If no special widget has been designated for this form field,
    // render it as a TextField
    return renderTextField(commonFieldProps, fieldInfo, handleFieldChange);
  }
}

FormField.propTypes = {
  errorText: PropTypes.any,
  fieldArrangementInfo: PropTypes.object.isRequired,
  fieldInfo: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FormField;

