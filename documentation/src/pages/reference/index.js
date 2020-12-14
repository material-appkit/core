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

function ReferencePage({ data, location }) {
  const classes = styles();

  return (
    <Layout
      location={location}
      showBackButton={false}
      title="API Reference"
    >
      <main className={classes.main}>
        <Typography component="h1">
          API Reference
        </Typography>
      </main>
    </Layout>
  );
}

ReferencePage.propTypes = COMMON_PAGE_PROPS;

export default ReferencePage;

