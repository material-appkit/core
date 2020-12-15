import React from 'react';

// import Typography from '@material-ui/core/Typography';

import Layout from 'layout/Layout';

import { COMMON_PAGE_PROPS } from 'variables';

import {
  PageTitle,
  ContentHeading,
  ContentSection,
} from 'components/typography';


function AboutPage(props) {
  return (
    <Layout
      showBackButton={false}
      title="About"
      {...props}
    >
      <main>
        <PageTitle>
          About Material-AppKit
        </PageTitle>

        <ContentSection>
          <ContentHeading>
            Motivation
          </ContentHeading>
        </ContentSection>

        <ContentSection>
          <ContentHeading>
            Design Philosophy
          </ContentHeading>
        </ContentSection>

        <ContentSection>
          <ContentHeading>
            The Author
          </ContentHeading>
        </ContentSection>
      </main>
    </Layout>
  );
}

AboutPage.propTypes = COMMON_PAGE_PROPS;

export default AboutPage;

