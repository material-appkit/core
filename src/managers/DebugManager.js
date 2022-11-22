import PropTypes from 'prop-types';
import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';


/**
 * A higher-order component serving as a globally available console
 * to collect and render log statements
 *
 * @public
 */
class DebugManager extends React.PureComponent {
  constructor(props) {
    super(props);

    DebugManager.__instance = this;
    this.viewRef = React.createRef();
    this.textFieldRef = React.createRef();
  }

  static show() {
    const view = DebugManager.__instance.viewRef.current;
    view.style.display = 'block';
  }

  static hide() {
    const view = DebugManager.__instance.viewRef.current;
    view.style.display = 'none';
  }

  static log(message) {
    const textField = DebugManager.__instance.textFieldRef.current;
    textField.value += `${message}\n`;
    textField.scrollTo(0, 1e10);
  }


  render() {
    const { classes } = this.props;

    return (
      <div
        className={classes.view}
        ref={this.viewRef}
      >
        <header className={classes.header}>
          <IconButton
            edge="end"
            onClick={() => this.textFieldRef.current.value = ''}
            size="small"
          >
            <DeleteIcon />
          </IconButton>

          <IconButton
            edge="end"
            onClick={() => DebugManager.hide()}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </header>

        <TextField
          className={classes.textField}
          InputProps={{
            classes: {
              multiline: classes.textArea,
            }
          }}
          inputRef={this.textFieldRef}
          fullWidth
          multiline
          minRows={8}
          maxRows={8}
          variant="outlined"
        />
      </div>
    );
  }
}


DebugManager.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles((theme) => ({
  view: {
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(0, 2, 2, 2),

    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'none',
    zIndex: 2000,
  },

  header: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(1),
    justifyContent: 'flex-end',
    padding: theme.spacing(0.5, 0),
  },

  textField: {
    backgroundColor: theme.palette.common.white,
  },

  textArea: {
    // alignItems: 'flex-start',
    fontSize: theme.typography.pxToRem(12),
    // height: '100%',
    // padding: theme.spacing(1),
  },



}))(DebugManager);
