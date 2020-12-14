import PropTypes from 'prop-types';
import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Layout from 'layout/Layout';

const styles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(2),
  },
}));

function HomePage({ data, location }) {
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

HomePage.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object,
  pageContext: PropTypes.object,
};

export default HomePage;

