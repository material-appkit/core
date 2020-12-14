import React from 'react';

// import Typography from '@material-ui/core/Typography';

import Layout from 'layout/Layout';

import {
  PageTitle,
  // ContentHeading,
  // ContentSection,
} from 'components/typography';

import { COMMON_PAGE_PROPS } from 'variables';


function ComponentsPage({ data, location }) {
  return (
    <Layout
      location={location}
      showBackButton={false}
      title="Components"
    >
      <main>
        <PageTitle>
          Components
        </PageTitle>
      </main>
    </Layout>
  );
}

ComponentsPage.propTypes = COMMON_PAGE_PROPS;

export default ComponentsPage;

