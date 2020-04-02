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

const getWidgetType = (fieldInfo) => {
  const { widget } = fieldInfo.ui;
  if (!widget) {
    return 'textfield';
  }
  if (typeof(widget) === 'string') {
    return widget;
  }
  return widget.type;
};

const getWidgetLabel = (fieldInfo) => {
  const { label, widget } = fieldInfo.ui;

  if (widget && typeof(widget) === 'object' && widget.label) {
    return widget.label;
  }

  return label;
};

//------------------------------------------------------------------------------
export const fromRepresentation = (value, fieldInfo) => {
  const widgetType = getWidgetType(fieldInfo);

  switch (widgetType) {
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
    case 'checkboxgroup':
      return value.map((v) => v.url);
    default:
      if (fieldInfo.type === 'checkbox') {
        switch (value) {
          case true:
          case 'true':
          case 'True':
            return (widgetType === 'switch')  ? true : 'true';
          case false:
          case undefined:
          case 'false':
          case 'False':
          case '':
            return (widgetType === 'switch')  ? false : 'false';
          default:
            throw new Error(`Invalid boolean value: ${value}`);
        }
      }

      return value || '';
  }
};

//------------------------------------------------------------------------------
export const toRepresentation = (value, fieldInfo, form) => {
  const widgetType = getWidgetType(fieldInfo);

  const WidgetClass = form.constructor.widgetClassForType(widgetType);
  if (WidgetClass && WidgetClass.hasOwnProperty('toRepresentation')) {
    return WidgetClass.toRepresentation(value, fieldInfo);
  }

  let coercedValue = value;
  if (!isValue(coercedValue) && isValue(fieldInfo.default)) {
    coercedValue = fieldInfo.default;
  }

  switch (fieldInfo.type) {
    case 'date':
    case 'datetime':
      return isValue(coercedValue) ? coercedValue : '';
    case 'number':
      return isValue(coercedValue) ? parseFloat(coercedValue) : null;
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

function renderTextField(commonFieldProps, fieldInfo, fieldIndex, onChange) {
  const widgetType = getWidgetType(fieldInfo);

  const classes = textFieldStyles();

  const textFieldProps = {
    ...commonFieldProps,
    fullWidth: true,
    InputLabelProps: { classes: { root: classes.inputLabel } },
    margin: "none",
    onChange: (e) => { onChange(e.target.value); },
    type: fieldInfo.type,
    variant: "outlined",
  };

  if (fieldIndex === 0) {
    textFieldProps.autoFocus = true;
  }

  if (fieldInfo.choices) {
    textFieldProps.select = true;
    textFieldProps.SelectProps = { native: true };
  }

  if (widgetType === 'textarea') {
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
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
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
    fieldIndex,
    fieldInfo,
    form,
    onChange,
  } = props;

  const widgetType = getWidgetType(fieldInfo);
  const widgetLabel = getWidgetLabel(fieldInfo);

  const fieldName = fieldInfo.key;

  const { formData } = form.state;

  const commonFieldProps = {
    name: fieldName,
    value: formData[fieldName],
  };

  if (fieldInfo.hidden || widgetType === 'hidden') {
    return <input type="hidden" {...commonFieldProps} />;
  }

  Object.assign(commonFieldProps, {
    error: errorText ? true : false,
    helperText: errorText || fieldInfo.ui.help,
    label: widgetLabel,
  });

  //----------------------------------------------------------------------------
  const handleFieldChange = (value) => {
    form.setValue(fieldName, value);
    onChange(value, fieldInfo);
  };

  let WidgetComponent = fieldArrangementInfo.widget;
  if (!WidgetComponent) {
    WidgetComponent = form.constructor.widgetClassForType(widgetType);
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

  switch (widgetType) {
    case 'switch':
      return renderSwitchField(commonFieldProps, fieldInfo, handleFieldChange);
    default:
      // If no special widget has been designated for this form field,
      // render it as a TextField
      return renderTextField(commonFieldProps, fieldInfo, fieldIndex, handleFieldChange);
  }
}

FormField.propTypes = {
  errorText: PropTypes.any,
  fieldArrangementInfo: PropTypes.object.isRequired,
  fieldInfo: PropTypes.object.isRequired,
  fieldIndex: PropTypes.number.isRequired,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FormField;

