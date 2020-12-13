import PropTypes from 'prop-types';
import React from 'react';

import { graphql } from 'gatsby';
import Img from 'gatsby-image';

import Box from '@material-ui/core/Box';

import Layout from 'layout/Layout';

//------------------------------------------------------------------------------
function HomePage({ data }) {
  return (
    <Layout
      pageTitle="Home"
      showBackButton={false}
      title={process.env.GATSBY_APP_TITLE}
    >
      <Box p={2}>
        <Img fixed={data.applicationLogo.childImageSharp.fixed} />
      </Box>
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
