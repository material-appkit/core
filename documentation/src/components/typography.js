import clsx from 'clsx';

import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

//------------------------------------------------------------------------------
export const PageTitle = withStyles((theme) => ({
  title: theme.mixins.pageTitle,
}))((props) => {
  return (
    <Typography
      component="h1"
      className={clsx(props.classes.title, props.className)}
    >
      {props.children}
    </Typography>
  );
});

export const ContentSection = (props) => {
  const {className, children, ...boxProps} = props;
  if (!boxProps.marginBottom) {
    boxProps.marginBottom = 4;
  }
  return (
    <Box
      component="section"
      className={className}
      {...boxProps}
    >
      {children}
    </Box>
  );
};

const CONTENT_HEADING_FONT_SIZES = {
  'h1': 24,
  'h2': 20,
  'h3': 18,
  'h4': 16,
};

export const ContentHeading = withStyles((theme) => ({
  heading: {
    flex: 1,
    fontWeight: 300,
  },
}))(({ children, classes, component, gutterBottom, underline }) => {
  const _component = component || 'h2';

  const style = {
    fontSize: CONTENT_HEADING_FONT_SIZES[_component],
  };

  if (underline) {
    style.borderBottom = `1px solid #424242`;
  }
  if (gutterBottom) {
    style.marginBottom = 8;
  }

  return (
    <Typography
      className={classes.heading}
      component={_component}
      style={style}
    >
      {children}
    </Typography>
  );
});

