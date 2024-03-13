/**
*
* DateTimeRangeWidget
*
*/

import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
// import Button from '@material-ui/core/Button';
// import FormControl from '@material-ui/core/FormControl';
// import IconButton from '@material-ui/core/IconButton';
// import Input from '@material-ui/core/Input';
// import InputLabel from '@material-ui/core/InputLabel';
// import { withStyles } from '@material-ui/core/styles';
// import CloseIcon from '@material-ui/icons/Close';

import DateWidget from './DateWidget';




function DateTimeRangeWidget(props) {
  const {
    error,
    fieldInfo,
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
      <DateWidget
        fieldInfo={{ type: 'date_and_time' }}
        label="Start"
        onChange={handleDateChange('lower')}
        value={dateRange.start}
      />
      <DateWidget
        fieldInfo={{ type: 'date_and_time' }}
        label="End"
        onChange={handleDateChange('upper')}
        value={dateRange.end}
      />
    </Box>
  );
}


DateTimeRangeWidget.fromRepresentation = (value, fieldInfo) => {
  const repr = {
    lower: null,
    upper: null,
  };

  if (!value) {
    return repr;
  }
};


DateTimeRangeWidget.toRepresentation = (value, fieldInfo) => {
  return {
    lower: value.lower ? value.lower.toISOString() : null,
    upper: value.upper ? value.upper.toISOString() : null,
  }
};


DateTimeRangeWidget.propTypes = {
  label: PropTypes.string,
  titleKey: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  value: PropTypes.any,
};


export default DateTimeRangeWidget;
