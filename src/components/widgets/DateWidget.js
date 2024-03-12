/**
*
* DateTimeField
*
*/

import dayjs from 'dayjs';

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import AlarmIcon from '@material-ui/icons/Alarm';

import {
  DateTimePicker,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers';


// -----------------------------------------------------------------------------
const dateTimeFieldStyles = makeStyles((theme) => ({
  fieldContainer: {
    width: '100%',
  },
}));

function DateWidget(props) {
  const classes = dateTimeFieldStyles();

  const [selectedDate, setSelectedDate] = useState(() => {
    let initialDate = null;

    if (props.value) {
      initialDate = props.value;

      if (typeof initialDate === 'string') {
        initialDate = dayjs(initialDate);
      }
    }
    return initialDate;
  });


  const handleDateChange = (value) => {
    setSelectedDate(value);

    if (props.onChange) {
      props.onChange(value);
    }
  };


  const handleTimeChange = (value) => {
    if (!(value && value.isValid())) {
      return;
    }

    value.year(selectedDate.year());
    value.month(selectedDate.month());
    value.date(selectedDate.date());
    setSelectedDate(value);

    if (props.onChange) {
      props.onChange(value);
    }
  };


  const renderField = () => {
    const { error, helperText } = props;
    const { type, ui } = props.fieldInfo;
    let widgetType = (ui && ui.widget) || type;

    let dateLabel = props.label;
    let DateComponent = null;
    let dateComponentFormat = null;

    switch (widgetType) {
      case 'date':
        DateComponent = KeyboardDatePicker;
        dateComponentFormat = "YYYY/MM/DD";
        break;
      case 'datetime':
        DateComponent = DateTimePicker;
        dateComponentFormat = "YYYY/MM/DD hh:mma";
        break;
      case 'date_and_time':
        DateComponent = KeyboardDatePicker;
        dateComponentFormat = "YYYY/MM/DD";
        dateLabel = `${dateLabel} Date`;
        break;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }

    const datePicker = (
      <DateComponent
        autoOk
        error={Boolean(error)}
        format={dateComponentFormat}
        fullWidth
        helperText={helperText}
        label={dateLabel}
        minutesStep={5}
        onChange={handleDateChange}
        value={selectedDate}
      />
    );

    if (widgetType !== 'date_and_time') {
      return datePicker;
    }

    return (
      <Box display="grid" gridAutoFlow="column" gridGap={24} justifyContent="space-between">
        {datePicker}

        <KeyboardTimePicker
          disabled={!selectedDate}
          keyboardIcon={<AlarmIcon />}
          label={`${props.label} Time`}
          onChange={handleTimeChange}
          minutesStep={5}
          value={selectedDate}
        />
      </Box>
    );
  };

  return (
    <div className={classes.fieldContainer}>
      {renderField()}
    </div>
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
  fieldInfo: PropTypes.object.isRequired,
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
};

export default DateWidget;
