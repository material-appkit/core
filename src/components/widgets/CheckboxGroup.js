/**
*
* CheckboxGroupWidget
*
*/

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  fieldset: theme.form.customControl.fieldset,
  legend: theme.form.customControl.legend,
}));

function CheckboxGroupWidget(props) {
  const {
    fieldInfo,
    label,
    onChange,
  } = props;

  const classes = styles();

  const [selection, setSelection] = useState(
    new Set(props.value || [])
  );

  const handleCheckboxClick = (choiceInfo) => {
    const newSelection = new Set(selection);
    if (newSelection.has(choiceInfo.value)) {
      newSelection.delete(choiceInfo.value);
    } else {
      newSelection.add(choiceInfo.value);
    }
    setSelection(newSelection);

    onChange(Array.from(newSelection));
  };

  let formGroupProps = {};
  const { widget } = fieldInfo.ui;
  if (typeof(widget) === 'object') {
    const { type, ...extra } = widget;
    formGroupProps = extra;
  }

  return (
    <FormControl fullWidth margin="dense">
      <fieldset className={classes.fieldset}>
        {label &&
          <legend className={classes.legend}>
            {label}
          </legend>
        }

        <FormGroup {...formGroupProps}>
          {fieldInfo.choices.map((choiceInfo) => (
            <FormControlLabel
              key={choiceInfo.value}
              control={(
                <Checkbox
                  checked={selection.has(choiceInfo.value)}
                  onClick={() => { handleCheckboxClick(choiceInfo); }}
                  value={choiceInfo.value}
                />
              )}
              label={choiceInfo.label}
            />
          ))}
        </FormGroup>
      </fieldset>
    </FormControl>
  );
}

CheckboxGroupWidget.propTypes = {
  fieldInfo: PropTypes.object.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};

export default CheckboxGroupWidget;
