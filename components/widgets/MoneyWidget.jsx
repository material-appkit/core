import clsx from 'clsx';

import PropTypes from 'prop-types';
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import AttributedTextField from '../AttributedTextField';
import NumberFormattedInput from './NumberFormattedInput';

import { toInt } from '../../util/transformers';
import DateWidget from "./DateWidget";

const styles = makeStyles((theme) => ({
  textField: {
    margin: theme.spacing(1, 0),

    [theme.breakpoints.down('sm')]: {
      flex: '1',
    },
  },

  inputRoot: {
    backgroundColor: theme.palette.common.white,
  },

  inputAdornedStart: {
    paddingLeft: theme.spacing(1),
  },
}));


function MoneyWidget(props) {
  const classes = styles();

  const { fieldInfo, error, ...rest } = props;

  return (
    <AttributedTextField
      className={clsx(classes.textField)}
      inputProps={{ pattern: '\\d*' }}
      InputProps={{
        classes: {
          root: classes.inputRoot,
        },
        inputComponent: NumberFormattedInput,
      }}
      {...rest}
    />
  )
}

MoneyWidget.toRepresentation = (value, fieldInfo) => {
  if (!value) {
    return null;
  }

  if (typeof(value) === 'string') {
    return Number(value);
  }

  return value;
};

MoneyWidget.propTypes = {
  error: PropTypes.bool,
  fieldInfo: PropTypes.object,
  helperText: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
};

MoneyWidget.defaultProps = {
  fullWidth: true,
  variant: 'outlined',
  valueTransformer: toInt,
};

export default MoneyWidget;