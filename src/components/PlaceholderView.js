import cx from 'classnames';

import PropTypes from 'prop-types';
import React from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  contentContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contentContainerUseAspectRatio: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  contentContainerUseBorder: {
    border: `3px dashed ${theme.palette.grey[600]}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

const PlaceholderView = React.forwardRef((props, ref) => {
  const classes = styles();

  const {
    aspectRatio,
    border,
    children,
    component,
    fullHeight,
    fullWidth,
    height,
    padding,
    ...componentProps
  } = props;

  const Component = component;
  const classNames = [classes.contentContainer];
  if (border) {
    classNames.push(classes.contentContainerUseBorder);
  }

  const boxProps = { p: padding };

  if (fullWidth) {
    boxProps.width = "100%";
  }

  if (aspectRatio) {
    boxProps.paddingBottom = `${100 / aspectRatio}%`;
    boxProps.position = 'relative';
    classNames.push(classes.contentContainerUseAspectRatio);
  } else {
    if (height) {
      boxProps.height = height;
    } else if (fullHeight) {
      boxProps.height = "100%";
    }
  }

  return (
    <Box {...boxProps}>
      <Component
        className={cx(classNames)}
        ref={ref}
        {...componentProps}
      >
        {children}
      </Component>
    </Box>
  );
});

PlaceholderView.propTypes = {
  aspectRatio: PropTypes.number,
  border: PropTypes.bool,
  children: PropTypes.node,
  component: PropTypes.any,
  fullHeight: PropTypes.bool,
  fullWidth: PropTypes.bool,
  height: PropTypes.number,
  padding: PropTypes.number,
};

PlaceholderView.defaultProps = {
  border: true,
  component: 'div',
  fullHeight: true,
  fullWidth: true,
  padding: 0,
};

export default PlaceholderView;
