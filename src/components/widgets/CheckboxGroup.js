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

  const [selection, setSelection] = useState(new Set());

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

  return (
    <FormControl fullWidth margin="dense">
      <fieldset className={classes.fieldset}>
        {label &&
          <legend className={classes.legend}>
            {label}
          </legend>
        }

        <FormGroup>
          {fieldInfo.choices.map((choiceInfo) => (
            <FormControlLabel
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
