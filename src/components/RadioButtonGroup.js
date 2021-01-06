import PropTypes from 'prop-types';
import React from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  radioGroup: {
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
  },

  radio: {
    borderRadius: 'initial',
    padding: '4px 9px',

    '&:not(:last-child)': {
      borderRight: `1px solid ${theme.palette.grey[400]}`,
    },
  },
}));


function RadioButtonGroup(props) {
  const classes = styles();

  const {
    choices,
    ...radioGroupProps
  } = props;

  return (
    <RadioGroup
      className={classes.radioGroup}
      row={true}
      {...radioGroupProps}
    >
      {choices.map((choice) => (
        <Radio
          className={classes.radio}
          key={choice.value}
          icon={<choice.Icon/>}
          inputProps={{ "aria-label" : choice.value }}
          checkedIcon={<choice.Icon />}
          value={choice.value}
        />
      ))}
    </RadioGroup>
  );
}

RadioButtonGroup.propTypes = {
  choices: PropTypes.array.isRequired,
};

export default RadioButtonGroup;
