/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

import { Helmet } from 'react-helmet-async';

function SEO({ description, lang, meta, title }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `
  );

  const metaDescription = description || site.siteMetadata.description;

  let pageTitleComponents = [site.siteMetadata.title];
  if (Array.isArray(title)) {
    pageTitleComponents = pageTitleComponents.concat(title);
  } else if (typeof(title) === 'string') {
    pageTitleComponents.push(title);
  }

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={pageTitleComponents.reverse().join(' | ')}
      // titleTemplate={`${site.siteMetadata.title} | %s`}
      meta={[
        {
          name: `viewport`,
          content: `minimum-scale=1, initial-scale=1, maximum-scale=1.0, user-scalable=0, width=device-width, shrink-to-fit=no`,
        },
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    >
      <link rel="canonical" href="https://material-appkit.com/" />
    </Helmet>
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
};

export default SEO;
