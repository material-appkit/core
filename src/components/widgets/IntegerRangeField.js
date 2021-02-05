import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  labelContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  sliderContainer: {
    lineHeight: 0,
    padding: theme.spacing(0, 1.5),
  },

  slider: {
    padding: theme.spacing(1, 0),
  },

  sliderLabel: theme.mixins.filterFieldLabel,
  sliderValue: theme.mixins.filterFieldValue,

}));


function IntegerRangeField(props) {
  const classes = styles();

  const {
    fieldName,
    label,
    onChange,
    min,
    max,
    value,
  } = props;

  const [sliderValue, setSliderValue] = useState(null);

  useEffect(() => {
    const minSliderValue = parseInt(value[0] || min);
    const maxSiderValue = parseInt(value[1] || max);
    setSliderValue([minSliderValue, maxSiderValue]);
  }, [min, max, value]);


  const handleSliderChange = (e, newValue) => {
    setSliderValue(newValue);
  };


  const handleSliderChangeCommitted = (e, newValue) => {
    const change = {};
    if (newValue[0] !== min) {
      change[`${fieldName}__gte`] = newValue[0];
    } else {
      change[`${fieldName}__gte`] = null;
    }

    if (newValue[1] !== max) {
      change[`${fieldName}__lte`] = newValue[1];
    } else {
      change[`${fieldName}__lte`] = null;
    }

    onChange(change);
  };

  if (!sliderValue) {
    return null;
  }

  return (
    <fieldset>
      <div className={classes.labelContainer}>
        <Typography className={classes.sliderLabel}>
          {label}
        </Typography>
        <Typography className={classes.sliderValue}>
          {sliderValue[0]} - {sliderValue[1]}
        </Typography>
      </div>

      <div className={classes.sliderContainer}>
        <Slider
          className={classes.slider}
          min={min}
          max={max}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderChangeCommitted}
          valueLabelDisplay="auto"
          value={sliderValue}
        />
      </div>
    </fieldset>
  );
}

IntegerRangeField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.array.isRequired,
};

export default React.memo(IntegerRangeField);
