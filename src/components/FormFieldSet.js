import PropTypes from 'prop-types';
import React from 'react';

import Grid from '@material-ui/core/Grid';

import FormField from './FormField';
import { getFieldInfoMap, getFieldNames } from './Form';


function FormFieldSet(props) {
  const {
    errors,
    fieldInfoProvider,
    form,
    onFieldChange,
    metadata,
  } = props;

  const fieldInfoMap = getFieldInfoMap(metadata);
  const fieldNames = getFieldNames(metadata, fieldArrangement);

  let fieldArrangement = props.fieldArrangement;
  if (!fieldArrangement) {
    // It is safe to assume that if we haven't been given an explicit field arrangement,
    // we HAVE been given a list of field metadata.
    // We can use that to dynamically generate a field arrangement.
    fieldArrangement = [];
    metadata.forEach((fieldInfo) => {
      if (!fieldInfo.read_only) {
        const fieldName = fieldInfo.key;
        if (fieldInfoProvider) {
          fieldArrangement.push(fieldInfoProvider(fieldInfo));
        } else {
          fieldArrangement.push({ name: fieldName });
        }
      }
    });
  }

  const handleFormFieldChange = (value, fieldInfo) => {
    onFieldChange(value, fieldInfo);
  };

  const renderFieldGroup = (fieldGroup, indexPath, childProps) => (
    fieldGroup.map((fieldArrangementInfo, fieldIndex) => {
      const fieldArrangementIndexPath = [...indexPath, fieldIndex];

      if (Array.isArray(fieldArrangementInfo)) {
        return renderFieldGroup(fieldArrangementInfo, fieldArrangementIndexPath, {
          xs: 12,
          md: Math.floor(12 / fieldArrangementInfo.length),
        });
      }

      if (typeof(fieldArrangementInfo) === 'string') {
        fieldArrangementInfo = {name: fieldArrangementInfo};
      }

      const fieldName = fieldArrangementInfo.name;

      return (
        <Grid
          container
          item
          key={fieldArrangementIndexPath.join(':')}
          xs={12}
          style={{ paddingLeft: 8, paddingRight: 8 }}
          {...childProps}
        >
          <FormField
            errorText={errors[fieldName]}
            form={form}
            fieldInfo={fieldInfoMap[fieldName]}
            fieldArrangementInfo={fieldArrangementInfo}
            onChange={handleFormFieldChange}
          />
        </Grid>
      );
    })
  );

  return (
    <Grid container>
      {renderFieldGroup(fieldArrangement, [0])}
    </Grid>
  );
}

FormFieldSet.propTypes = {
  errors: PropTypes.object,
  form: PropTypes.object.isRequired,
  fieldArrangement: PropTypes.array,
  fieldInfoProvider: PropTypes.func,
  onFieldChange: PropTypes.func.isRequired,
  metadata: PropTypes.array,
};

export default FormFieldSet;
