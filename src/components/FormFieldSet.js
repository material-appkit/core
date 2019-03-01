import PropTypes from 'prop-types';
import React from 'react';

import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

import { decorateErrors } from '../util/component';

import ItemListField from './ItemListField';
import { valueForKeyPath } from '../util/object';

function FormFieldSet(props) {
  const {
    classes,
    errors,
    fieldArrangementMap,
    fieldInfoMap,
    fieldNames,
    form,
  } = props;

  const formData = form.state.formData;

  const fields = [];
  fieldNames.forEach((fieldName) => {
    const fieldInfo = fieldInfoMap[fieldName];
    if (!fieldInfo.read_only) {
      let field = null;
      const value = formData[fieldName];
      const label = fieldInfo.ui ? fieldInfo.ui.label : null;

      const commonFieldProps = {
        key: fieldName,
        label,
        name: fieldName,
      };

      if (fieldInfo.hidden) {
        field = (
          <input type="hidden" {...commonFieldProps} />
        );
      } else if (fieldInfo.type === 'itemlist') {
        const fieldArrangementInfo = fieldArrangementMap[fieldName];

        field = (
          <ItemListField
            items={value}
            listUrl={`${fieldInfo.related_endpoint.singular}/`}
            onChange={(value) => { form.setValue(fieldName, value); }}
            {...commonFieldProps}
            {...fieldArrangementInfo}
          />
        );
      } else {
        const textFieldProps = {
          ...commonFieldProps,
          disabled: props.saving,
          fullWidth: true,
          InputLabelProps: { classes: { root: classes.inputLabel } },
          margin: "normal",
          onChange: (e) => { form.setValue(fieldName, e.target.value); },
          value,
          variant: "outlined",
        };

        if (fieldInfo.choices) {
          textFieldProps.select = true;
          textFieldProps.SelectProps = { native: true };
        } else {
          const inputType = fieldInfo.type;
          if (inputType === 'textarea') {
            textFieldProps.multiline = true;
            textFieldProps.rows = 2;
            textFieldProps.rowsMax = 20;
          } else {
            textFieldProps.type = inputType;
          }
        }

        if (fieldInfo.type === 'number') {
          textFieldProps.inputProps = { min: 0, step: 'any' };
        }

        field = (
          <TextField {...textFieldProps }>
            {fieldInfo.choices &&
              <React.Fragment>
                <option />
                {fieldInfo.choices.map((choice) => (
                  <option key={choice.value} value={choice.value}>{choice.label}</option>
                ))}
              </React.Fragment>
            }
          </TextField>
        );
      }

      fields.push(decorateErrors(field, errors));
    }
  });

  return fields;
}

FormFieldSet.propTypes = {
  classes: PropTypes.object.isRequired,
  errors: PropTypes.object,
  form: PropTypes.object.isRequired,
  fieldArrangementMap: PropTypes.object,
  fieldInfoMap: PropTypes.object,
  fieldNames: PropTypes.array,
  saving: PropTypes.bool,
};

export default withStyles((theme) => {
  return theme.form;
})(FormFieldSet);
