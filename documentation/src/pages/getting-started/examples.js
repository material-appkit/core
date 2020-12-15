import React from 'react';

// import Typography from '@material-ui/core/Typography';

import Layout from 'layout/Layout';

import {
  PageTitle,
  ContentHeading,
  ContentSection,
} from 'components/typography';

import { COMMON_PAGE_PROPS } from 'variables';

function ExamplesPage(props) {
  return (
    <Layout
      showBackButton={false}
      title="Examples"
      {...props}
    >
      <main>
        <PageTitle>
          Examples
        </PageTitle>

        <ContentSection>
          <ContentHeading>
            PWA Skeleton
          </ContentHeading>
        </ContentSection>

        <ContentSection>
          <ContentHeading>
            Gatsby Skeleton
          </ContentHeading>
        </ContentSection>
      </main>
    </Layout>
  );
}

ExamplesPage.propTypes = COMMON_PAGE_PROPS;

export default ExamplesPage;

