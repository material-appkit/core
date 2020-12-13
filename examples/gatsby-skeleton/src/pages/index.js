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
      <Box p={2} textAlign="center">
        <Img fixed={data.applicationLogo.childImageSharp.fixed} />

        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>

        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>

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
