import PropTypes from 'prop-types';

import React from 'react';

import Layout from 'layout/Layout';

//------------------------------------------------------------------------------
function NotFoundPage(props) {
  return (
    <Layout
      pageTitle="Page Not Found"
      title={process.env.GATSBY_APP_TITLE}
    >
      Not Found
    </Layout>
  );
}

NotFoundPage.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object,
  pageContext: PropTypes.object,
};

export default NotFoundPage;
