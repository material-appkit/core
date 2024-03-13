/**
*
* DateTimeRangeWidget
*
*/

import dayjs from 'dayjs';

import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import DateWidget from './DateWidget';


function DateTimeRangeWidget(props) {
  const {
    error,
    fieldInfo,
    helperText,
    label,
    onChange,
    value,
  } = props;


  const [dateRange, setDateRange] = useState(value);


  const handleDateChange = (property) => (value) => {
    const _dateRange = { ...dateRange, [property]: value };
    setDateRange(_dateRange);
    onChange(_dateRange);
  };


  return (
    <Box component="fieldset" display="flex" flexDirection="column" gridGap={16}>
      {error && helperText && (
        <Alert severity="error">{helperText[0]}</Alert>
      )}

      <DateWidget
        fieldInfo={{ type: 'date_and_time' }}
        label="Start"
        onChange={handleDateChange('lower')}
        value={dateRange.lower}
      />
      <DateWidget
        fieldInfo={{ type: 'date_and_time' }}
        label="End"
        onChange={handleDateChange('upper')}
        value={dateRange.upper}
      />
    </Box>
  );
}


DateTimeRangeWidget.fromRepresentation = (value, fieldInfo) => {
  const repr = {
    lower: null,
    upper: null,
  };

  if (value) {
    if (value.lower) {
      repr.lower = dayjs(value.lower);
    }
    if (value.upper) {
      repr.upper = dayjs(value.upper);
    }
  }

  return repr;
};


DateTimeRangeWidget.toRepresentation = (value, fieldInfo) => {
  const repr = {};

  if (value.lower) {
    repr.lower = value.lower.toISOString();
  }
  if (value.upper) {
    repr.upper = value.upper.toISOString();
  }

  return repr;
};


DateTimeRangeWidget.propTypes = {
  error: PropTypes.bool,
  helperText: PropTypes.array,
  label: PropTypes.string,
  titleKey: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};


export default DateTimeRangeWidget;
