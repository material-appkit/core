import PropTypes from 'prop-types';
import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const styles = makeStyles({
  splitView: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },

  bar: {
    // position: 'absolute',
  },

  content: {
    // position: 'absolute',
  },
});


function SplitView(props) {
  const {
    bar,
    barSize,
    breakpoint,
    children,
    placement,
    scrollContent,
  } = props;

  const classes = styles();
  const theme = useTheme();

  let matches = true;
  if (breakpoint) {
    matches = useMediaQuery(theme.breakpoints.up(breakpoint));
  }

  const splitViewStyles = {};
  const barStyles = {};
  const contentStyles = {};
  if (scrollContent) {
    contentStyles.overflow = 'auto';
  }

  switch (placement) {
    case 'top':
      Object.assign(barStyles, {
        top: 0,
        right: 0,
        left: 0,
        height: barSize,
        position: 'absolute',
      });
      Object.assign(contentStyles, {
        top: barSize,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute',
      });
      break;
    case 'bottom':
      break;
    case 'left':
      if (matches) {
        Object.assign(barStyles, {
          top: 0,
          left: 0,
          bottom: 0,
          width: barSize,
          position: 'absolute',
        });
        Object.assign(contentStyles, {
          top: 0,
          right: 0,
          left: barSize,
          bottom: 0,
          position: 'absolute',
        });
      } else {

      }
      break;
    case 'right':
      if (matches) {
        Object.assign(barStyles, {
          position: 'absolute',
          top: 0,
          width: barSize,
          bottom: 0,
          right: 0,
        });
        Object.assign(contentStyles, {
          position: 'absolute',
          top: 0,
          left: 0,
          right: barSize,
          bottom: 0,
        });
      } else {

      }
      break;
  }

  return (
    <div className={classes.splitView} style={splitViewStyles}>
      <div style={barStyles}>
        {bar}
      </div>
      <div style={contentStyles}>
        {children}
      </div>
    </div>
  );
}

SplitView.propTypes = {
  bar: PropTypes.object.isRequired,
  barSize: PropTypes.number.isRequired,
  breakpoint: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  classes: PropTypes.object,
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  scrollContent: PropTypes.bool,
};

SplitView.defaultProps = {
  scrollContent: false,
};

export default SplitView;
