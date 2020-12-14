import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Layout from 'layout/Layout';

import { COMMON_PAGE_PROPS } from 'variables';

const styles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(2),
  },
}));

function AboutPage({ data, location }) {
  const classes = styles();

  return (
    <Layout
      location={location}
      showBackButton={false}
      title="About"
    >
      <main className={classes.main}>
        <Typography component="h1">
          About Material-AppKit
        </Typography>
      </main>
    </Layout>
  );
}

AboutPage.propTypes = COMMON_PAGE_PROPS;

export default AboutPage;

