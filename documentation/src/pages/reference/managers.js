import React from 'react';

// import Typography from '@material-ui/core/Typography';

import Layout from 'layout/Layout';

import {
  PageTitle,
  // ContentHeading,
  // ContentSection,
} from 'components/typography';
import { COMMON_PAGE_PROPS } from 'variables';

function ManagersPage(props) {
  return (
    <Layout
      showBackButton={false}
      title="Managers"
      {...props}
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

