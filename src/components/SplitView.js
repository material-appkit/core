import PropTypes from 'prop-types';
import React from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => (theme.splitView));

function SplitView(props) {
  const {
    bar,
    barSize,
    children,
    placement,
    scrollContent,
  } = props;

  const classes = styles();


  const splitViewStyles = {
    width: '100%',
    height: '100%',
    position: 'relative',
  };

  const barStyles = { ...props.barStyles };
  const contentStyles = { ...props.contentStyles };

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
      Object.assign(barStyles, {
        bottom: 0,
        right: 0,
        left: 0,
        height: barSize,
        position: 'absolute',
      });
      Object.assign(contentStyles, {
        top: 0,
        right: 0,
        left: 0,
        position: 'absolute',
      });
      break;
    case 'left':
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
      break;
    case 'right':
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
      break;
  }

  return (
    <Box className={classes.container} style={splitViewStyles}>
      <Box className={classes.bar} style={barStyles}>
        {bar}
      </Box>
      <Box className={classes.content} style={contentStyles}>
        {children}
      </Box>
    </Box>
  );
}

SplitView.propTypes = {
  bar: PropTypes.object.isRequired,
  barSize: PropTypes.number.isRequired,
  barStyles: PropTypes.object,
  children: PropTypes.object,
  classes: PropTypes.object,
  contentStyles: PropTypes.object,
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  scrollContent: PropTypes.bool,
};

SplitView.defaultProps = {
  barStyles: {},
  contentStyles: {},
  scrollContent: false,
};

export default SplitView;
