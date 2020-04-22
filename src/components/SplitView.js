import classNames from 'classnames';

import PropTypes from 'prop-types';
import React from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  splitView: {
    display: 'flex',
    height: '100%',
    width: '100%',

    "-webkitOverflowScrolling": 'touch',
  }
}));

function SplitView(props) {
  const {
    bar,
    barSize,
    children,
    placement,
    scrollContent,
  } = props;

  const classes = styles();

  let flexDirection = null;
  const barStyles = {};
  const contentStyles = { flex: 1 };

  if (scrollContent) {
    contentStyles.overflow = 'auto';
  }

  switch (placement) {
    case 'top':
      flexDirection = 'column';

      Object.assign(barStyles, {
        height: barSize,
      });
      break;

    case 'bottom':
      flexDirection = 'column';

      Object.assign(barStyles, {
        height: barSize,
        order: 1,
      });
      Object.assign(contentStyles, {
        order: 0,
      });
      break;

    case 'left':
      flexDirection = 'row';

      Object.assign(barStyles, {
        width: barSize,
      });
      break;

    case 'right':
      flexDirection = 'row';

      Object.assign(barStyles, {
        width: barSize,
        order: 1,
      });
      Object.assign(contentStyles, {
        order: 0,
      });
      break;
  }

  return (
    <Box width="100%" height="100%" display="flex" flexDirection={flexDirection}>
      <Box className={classNames(classes.bar, props.barClassName)} style={barStyles}>
        {bar}
      </Box>
      <Box className={classNames(classes.content, props.contentClassName)} style={contentStyles}>
        {children}
      </Box>
    </Box>
  );
}

SplitView.propTypes = {
  bar: PropTypes.object.isRequired,
  barSize: PropTypes.number.isRequired,
  barClassName: PropTypes.string,
  children: PropTypes.object,
  classes: PropTypes.object,
  contentClassName: PropTypes.string,
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  scrollContent: PropTypes.bool,
};

SplitView.defaultProps = {
  scrollContent: false,
};

export default SplitView;
