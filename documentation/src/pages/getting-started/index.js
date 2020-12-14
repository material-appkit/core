import React from 'react';

// import Typography from '@material-ui/core/Typography';

import Layout from 'layout/Layout';

import { COMMON_PAGE_PROPS } from 'variables';

import {
  PageTitle,
  ContentHeading,
  ContentSection,
} from 'components/typography';


function GettingStartedPage({ data, location }) {
  return (
    <Layout
      location={location}
      showBackButton={false}
      title="Getting Started"
    >
      <main>
        <PageTitle>
          Getting started
        </PageTitle>

        <ContentSection>
          <ContentHeading>
            Installation
          </ContentHeading>
        </ContentSection>

        <ContentSection>
          <ContentHeading>
            Usage
          </ContentHeading>
        </ContentSection>
      </main>
    </Layout>
  );
}

GettingStartedPage.propTypes = COMMON_PAGE_PROPS;

export default GettingStartedPage;

