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

export const ContentSection = withStyles((theme) => ({
  section: {
    marginBottom: theme.spacing(3),
  },
}))((props) => {
  const { classes, className, children, ...boxProps } = props;
  return (
    <Box
      component="section"
      className={clsx(classes.section, className)}
      {...boxProps}
    >
      {children}
    </Box>
  );
});

export const ContentHeading = withStyles((theme) => ({
  h2: {
    borderBottom: `1px solid ${theme.palette.grey[800]}`,
    fontSize: theme.typography.pxToRem(18),
    fontWeight: 400,
    marginBottom: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}))((props) => {
  return (
    <Typography
      variant="h2"
      classes={{ h2: props.classes.h2 }}
    >
      {props.children}
    </Typography>
  );
});

