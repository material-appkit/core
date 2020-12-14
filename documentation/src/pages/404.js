import PropTypes from 'prop-types';
import React from 'react';

import { graphql } from 'gatsby';
import Img from 'gatsby-image';

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
}));


function NotFoundPage({ data }) {
  const classes = styles();

  return (
    <Layout
      title="Page Not Found"
    >
      <main className={classes.main}>
        <div className={classes.contentContainer}>
          <Img fixed={data.sadFace.childImageSharp.fixed} />
        </div>
      </main>
    </Layout>
  );
}

NotFoundPage.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object,
  pageContext: PropTypes.object,
};

export default NotFoundPage;

export const query = graphql`
  query {
    sadFace: file(relativePath: { eq: "sad-face.png" }) {
      childImageSharp {
        fixed(width: 192, height: 192) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;