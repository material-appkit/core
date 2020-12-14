import React from 'react';

// import Typography from '@material-ui/core/Typography';

import Layout from 'layout/Layout';

import {
  PageTitle,
  // ContentHeading,
  // ContentSection,
} from 'components/typography';
import { COMMON_PAGE_PROPS } from 'variables';

function ManagersPage({ data, location }) {
  return (
    <Layout
      location={location}
      showBackButton={false}
      title="Managers"
    >
      <main>
        <PageTitle>
          Managers
        </PageTitle>
      </main>
    </Layout>
  );
}

ManagersPage.propTypes = COMMON_PAGE_PROPS;

export default ManagersPage;

