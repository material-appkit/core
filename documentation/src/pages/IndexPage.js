import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ViewController from '@material-appkit/core/components/ViewController';

import { staticUrl } from 'util/shortcuts';
import { COMMON_PAGE_PROPS } from 'variables';

const styles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(8, 2, 2),
    textAlign: 'center',
  },

  appTitle: {
    fontSize: theme.typography.pxToRem(28),
    fontWeight: 300,
    letterSpacing: '0.7rem',
    marginTop: theme.spacing(2),
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
        <img
          alt="Material-AppKit Logo"
          src={staticUrl('android-chrome-192x192.png')}
        />
        <Typography component="h1" className={classes.appTitle}>
          MATERIAL-APPKIT
        </Typography>
      </main>
    </ViewController>
  );
}

IndexPage.propTypes = COMMON_PAGE_PROPS;

export default IndexPage;
