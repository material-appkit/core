import PropTypes from 'prop-types';
import React from 'react';

import { graphql } from 'gatsby';
import Img from 'gatsby-image';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Layout from 'layout/Layout';

const styles = makeStyles((theme) => ({
  main: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(6, 0, 2),
  },

  contentContainer: {
    textAlign: 'center',
  },

  titleContainer: {
    marginTop: theme.spacing(2),
  },

  title: {
    fontSize: theme.typography.pxToRem(28),
    fontWeight: 300,
    letterSpacing: '0.5rem',
    textTransform: 'uppercase',
  },

  version: {
    fontSize: theme.typography.pxToRem(20),
    letterSpacing: '0.2rem',
  }
}));

function HomePage({ data, location }) {
  const classes = styles();

  return (
    <Layout
      location={location}
      showBackButton={false}
      title="Introduction"
    >
      <main className={classes.main}>
        <div className={classes.contentContainer}>
          <Img fixed={data.applicationLogo.childImageSharp.fixed} />

          <div className={classes.titleContainer}>
            <Typography component="h1" color="primary" className={classes.title}>
              {process.env.GATSBY_APP_TITLE}
            </Typography>

            <Typography component="h2" className={classes.version}>
              v{process.env.GATSBY_APP_VERSION}
            </Typography>
          </div>
        </div>
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

export const query = graphql`
  query {
    applicationLogo: file(relativePath: { eq: "application-logo.png" }) {
      childImageSharp {
        fixed(width: 256, height: 256) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;
