import React from 'react';

// import Typography from '@material-ui/core/Typography';

import Layout from 'layout/Layout';

import {
  PageTitle,
  // ContentHeading,
  // ContentSection,
} from 'components/typography';
import { COMMON_PAGE_PROPS } from 'variables';


function UtilitiesPage({ data, location }) {
  return (
    <Layout
      location={location}
      showBackButton={false}
      title="Utilities"
    >
      <main>
        <PageTitle>
          Utilities
        </PageTitle>
      </main>
    </Layout>
  );
}

UtilitiesPage.propTypes = COMMON_PAGE_PROPS;

export default UtilitiesPage;

