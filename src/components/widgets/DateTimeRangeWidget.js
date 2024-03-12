/**
*
* DateTimeRangeWidget
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';



class DateTimeRangeWidget extends React.PureComponent {
  static toRepresentation(value) {
    return value ? value.url : null;
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedModel: props.value,
      buttonLabel: ''
    };
  }

  render() {
    const {
      classes,
      fieldInfo,
      label,
      value,
    } = this.props;

    return (
      <Box className={classes.splitStack} component="fieldset" display="flex" alignItems="center" justifyContent="space-between" width="100%">
        <FormControl margin="none">
          <InputLabel shrink>
            Start
          </InputLabel>
          <Input />
        </FormControl>

        <FormControl margin="none">
          <InputLabel shrink>
            End
          </InputLabel>
          <Input />
        </FormControl>
      </Box>
    );
  }
}

DateTimeRangeWidget.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string,
  titleKey: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  value: PropTypes.any,
};

DateTimeRangeWidget.defaultProps = {

};

export default withStyles((theme) => ({
  splitStack: theme.mixins.layout.splitStack,
  button: {
    minWidth: 'initial',
  },
  clearButton: {
    padding: 6,
  }
}))(DateTimeRangeWidget);
