import PropTypes from 'prop-types';
import React from 'react';

import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';


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
  }

  static show() {
    const view = DebugManager.__instance.viewRef.current;
    view.style.display = 'block';
  }

  static hide() {
    const view = DebugManager.__instance.viewRef.current;
    view.style.display = 'none';
  }

  static log(messageInfo) {
    DebugManager.__instance.__log(messageInfo);
  }


  __log = (messageInfo) => {
    console.log(messageInfo);
  };


  render() {
    const { classes } = this.props;

    return (
      <div
        className={classes.view}
        ref={this.viewRef}
      >
        <header className={classes.header}>
          <IconButton
            className={classes.closeButton}
            edge="end"
            onClick={() => DebugManager.hide()}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </header>

        <Box height="100%" flex={1}>
          <TextField
            className={classes.textField}
            InputProps={{
              classes: {
                root: classes.textArea,
              }
            }}
            fullWidth
            multiline
            variant="outlined"
          />
        </Box>
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
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 2, 2, 2),

    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    display: 'none',
  },

  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0.5, 0),
  },

  textField: {
    backgroundColor: theme.palette.common.white,
    height: '100%',
  },

  textArea: {
    alignItems: 'flex-start',
    height: '100%',
  },



}))(DebugManager);
