/**
*
* ItemListField
*
*/

import moment from 'moment';
import MomentUtils from '@date-io/moment';

import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import withStyles from '@material-ui/core/styles/withStyles';

import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from "material-ui-pickers";


class DateTimeField extends React.PureComponent {
    constructor(props) {
    super(props);

    let selectedDate = null;
    if (props.value) {
      selectedDate = props.value;
      if (typeof selectedDate === 'string') {
        selectedDate = moment(selectedDate);
      }
    }
    // TODO: Let the timezone be an optional property?
    this.state = {
      selectedDate,
    };
  }

  handleDateChange = (value) => {
    this.setState({ selectedDate: value });

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  render() {
    const { classes, label } = this.props;

    return (
      <FormControl fullWidth margin="dense">
        <fieldset className={classes.fieldset}>
          {label &&
            <legend className={classes.legend}>{label}</legend>
          }
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DateTimePicker
              autoOk
              value={this.state.selectedDate}
              onChange={this.handleDateChange}
            />
          </MuiPickersUtilsProvider>
        </fieldset>
      </FormControl>
    );
  }
}

DateTimeField.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string,
  value: PropTypes.any,
};

DateTimeField.defaultProps = {
};

export default withStyles((theme) => ({
  fieldset: theme.form.customControl.fieldset,
  legend: theme.form.customControl.legend,
}))(DateTimeField);
