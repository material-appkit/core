import React from 'react';

// import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Layout from 'layout/Layout';

import { COMMON_PAGE_PROPS } from 'variables';

import {
  PageTitle,
  ContentHeading,
  ContentSection,
} from 'components/typography';

const styles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(2),
  },
}));

function GettingStartedPage({ data, location }) {
  const classes = styles();

  return (
    <Layout
      location={location}
      showBackButton={false}
      title="Getting Started"
    >
      <main className={classes.main}>
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

