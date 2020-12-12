import PropTypes from 'prop-types';

import React, { useContext } from 'react';

import AppBar from '@material-ui/core/AppBar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ApplicationMenuControl from './ApplicationMenuControl';
import AppContext from 'AppContext';

//------------------------------------------------------------------------------
const styles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.appBar + 2,
    justifyContent: 'center',
    position: 'relative',
  },

  progressBar: {
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 62,
  },

  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },

  toolBar: {
    minHeight: theme.topbar.height,
    padding: theme.spacing(0, 0.5, 0, 2),
  },

  appTitle: {
    color: 'inherit',
    fontSize: theme.typography.pxToRem(20),
    letterSpacing: 0,
  },

  buildLabel: {
    fontFamily: 'monospace',
    fontSize: theme.typography.pxToRem(11),
    lineHeight: 1,
  },
}));

function ApplicationBar(props) {
  const classes = styles();

  const context = useContext(AppContext);
  const { loadProgress } = context;

  const { navLinkArrangement } = props;

  return (
    <AppBar
      className={classes.appBar}
      color="primary"
      elevation={2}
      position="static"
    >
      <Toolbar className={classes.toolBar}>
        <ApplicationMenuControl
          navLinkArrangement={navLinkArrangement}
        />

        <Typography className={classes.appTitle}>
          Material AppKit
        </Typography>
      </Toolbar>

      {loadProgress !== null &&
        <LinearProgress className={classes.progressBar} />
      }
    </AppBar>
  );
}

ApplicationBar.propTypes = {
  navLinkArrangement: PropTypes.array.isRequired,
};


ApplicationBar.defaultProps = {
  navLinkArrangement: [],
};

export default ApplicationBar;
