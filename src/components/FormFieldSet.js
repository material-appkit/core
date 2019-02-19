import PropTypes from 'prop-types';
import React from 'react';

import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';

import { decorateErrors } from '../util/component';

import ItemListField from './ItemListField';

function FormFieldSet(props) {
  const {
    classes,
    errors,
    fieldArrangementMap,
    fieldInfoMap,
    fieldNames,
    representedObject,
  } = props;

  const fields = [];
  fieldNames.forEach((fieldName) => {
    const fieldInfo = fieldInfoMap[fieldName];
    if (!fieldInfo.read_only) {
      let field = null;
      const defaultValue = representedObject[fieldName] || '';

      if (fieldInfo.hidden) {
        field = (
          <input type="hidden" name={fieldName} defaultValue={defaultValue} />
        );
      } else if (fieldInfo.type === 'itemlist') {
        const fieldArrangementInfo = fieldArrangementMap[fieldName];
        field = (
          <ItemListField
            defaultItems={representedObject[fieldName]}
            listUrl={`${fieldInfo.related_endpoint.singular}/`}
            name={fieldName}
            label={fieldInfo.ui.label}
            {...fieldArrangementInfo}
          />
        );
      } else {
        const textFieldProps = {
          disabled: props.saving,
          key: fieldName,
          fullWidth: true,
          InputLabelProps: { classes: { root: classes.inputLabel } },
          label: fieldInfo.ui.label,
          margin: "normal",
          name: fieldName,
          defaultValue,
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
            textFieldProps.rowsMax = 4;
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
                  <option key={choice.value} value={choice.value}>{choice.display_name}</option>
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
  fieldInfoMap: PropTypes.object,
  fieldNames: PropTypes.array,
  representedObject: PropTypes.object,
  saving: PropTypes.bool,
};

export default withStyles((theme) => {
  return theme.form;
})(FormFieldSet);
