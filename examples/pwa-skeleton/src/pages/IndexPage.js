import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ViewController from '@material-appkit/core/components/ViewController';

import { COMMON_PAGE_PROPS } from 'variables';

import AppLogo from 'images/app-logo.png';

const styles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },

  logoContainer: {
    margin: theme.spacing(6, 0, 2),

  },

  title: {
    fontSize: theme.typography.pxToRem(28),
    fontWeight: 300,
    letterSpacing: '0.7rem',
    textTransform: 'uppercase',
  },
}));

function IndexPage(props) {
  const classes = styles();

  return (
    <ViewController
      title="Welcome"
      {...props}
    >
      <main className={classes.main}>
        <div className={classes.logoContainer}>
          <img alt="Application Logo" src={AppLogo} />
        </div>

        <Typography component="h1" color="primary" className={classes.title}>
          {process.env.REACT_APP_TITLE}
        </Typography>

        <Typography component="h2" className={classes.title}>
          PWA Skeleton
        </Typography>
      </main>
    </ViewController>
  );
}

IndexPage.propTypes = COMMON_PAGE_PROPS;

export default IndexPage;
