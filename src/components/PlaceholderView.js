import cx from 'classnames';

import PropTypes from 'prop-types';
import React from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  borderedContent: {
    border: `3px dashed ${theme.palette.grey[600]}`,
    borderRadius: theme.shape.borderRadius,
  }
}));

const PlaceholderView = React.forwardRef((props, ref) => {
  const classes = styles();

  const {
    border,
    children,
    component,
    padding,
    ...componentProps
  } = props;

  const Component = component;
  const classNames = [classes.content];
  if (border) {
    classNames.push(classes.borderedContent);
  }

  return (
    <Box width="100%" height="100%" p={padding}>
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
  border: PropTypes.bool,
  children: PropTypes.node,
  component: PropTypes.any,
  padding: PropTypes.number,
};

PlaceholderView.defaultProps = {
  border: true,
  component: 'div',
  padding: 0,
};

export default PlaceholderView;
