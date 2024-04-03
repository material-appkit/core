import dayjs from 'dayjs';

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';


function DateWidget(props) {
  const { fieldInfo, error, helperText, label, onChange, value } = props;

  let widgetType = 'date';
  if (fieldInfo) {
    const { type, ui } = fieldInfo;
    widgetType = (ui && ui.widget) || type;
  }

  const [dateValue, setDateValue] = useState(() => {
    return value ? value.format('YYYY-MM-DD') : ''
  });
  const [timeValue, setTimeValue] = useState(() => {
    return value ? value.format('HH:mm:ss') : '00:00:00'
  });


  const handleFieldChange = (fieldType) => (e) => {
    const fieldValue = e.target.value;
    if (!fieldValue) {
      return;
    }

    let newDateValue = dateValue;
    let newTimeValue = timeValue;
    if (fieldType === 'date') {
      setDateValue(fieldValue);
      newDateValue = fieldValue;
    } else {
      setTimeValue(fieldValue);
      newTimeValue = fieldValue;
    }

    if (onChange) {
      onChange(dayjs(`${newDateValue} ${newTimeValue}`))
    }
  };

  const datePicker = (
    <TextField
      error={Boolean(error)}
      fullWidth
      helperText={helperText}
      InputLabelProps={{ shrink: true }}
      inputProps={{ pattern: "\d{4}-\d{2}-\d{2}" }}
      label={`${label} Date`}
      onChange={handleFieldChange('date')}
      type="date"
      value={dateValue}
    />
  );

  if (widgetType !== 'date_and_time') {
    return datePicker;
  }

  return (
    <Box display="grid" gridGap={20} gridTemplateColumns="1fr 1fr">
      {datePicker}

      <TextField
        disabled={!value}
        fullWidth
        InputLabelProps={{ shrink: true }}
        inputProps={{ step: 900 }}
        label={`${label} Time`}
        onChange={handleFieldChange('time')}
        type="time"
        value={timeValue}
      />
    </Box>
  );
}


DateWidget.toRepresentation = (value, fieldInfo) => {
  if (!value) {
    return null;
  }

  if (typeof(value) === 'string') {
    return value;
  }

  if (fieldInfo.type === 'date') {
    return value.format('YYYY-MM-DD');
  }

  return value.format();
};

DateWidget.propTypes = {
  error: PropTypes.bool,
  fieldInfo: PropTypes.object,
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
};

export default DateWidget;
