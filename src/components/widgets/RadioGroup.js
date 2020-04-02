/**
*
* RadioGroupWidget
*
*/

import React, { useState } from 'react';
import PropTypes from 'prop-types';


import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  fieldset: theme.form.customControl.fieldset,
  legend: theme.form.customControl.legend,

  radioGroup: {
    padding: `0 ${theme.spacing(1)}px`,
  },

  radio: {
    padding: theme.spacing(0.5),
  },
}));

function RadioGroupWidget(props) {
  const {
    fieldInfo,
    label,
    onChange,
  } = props;

  const classes = styles();
  const [selectedValue, setSelectedValue] = useState(props.value);

  const handleRadioButtonClick = (choice) => {
    let value = choice.value;
    if (value === selectedValue) {
      value = null;
    }

    setSelectedValue(value);
    onChange(value);
  };

  return (
    <FormControl fullWidth margin="none">
      <fieldset className={classes.fieldset}>
        {label &&
          <legend className={classes.legend}>
            {label}
          </legend>
        }

        <RadioGroup
          className={classes.radioGroup}
          row={fieldInfo.ui.direction === 'row'}
          value={selectedValue}
        >
          {fieldInfo.choices.map((choice) => (
            <FormControlLabel
              control={(
                <Radio
                  onClick={() => { handleRadioButtonClick(choice); }}
                  className={classes.radio}
                />
              )}
              key={choice.value}
              label={choice.label}
              value={choice.value}
            />
          ))}
        </RadioGroup>
      </fieldset>
    </FormControl>
  );
}

RadioGroupWidget.propTypes = {
  fieldInfo: PropTypes.object.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};

export default RadioGroupWidget;
