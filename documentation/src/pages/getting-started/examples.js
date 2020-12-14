import React from 'react';

// import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Layout from 'layout/Layout';

import {
  PageTitle,
  ContentHeading,
  ContentSection,
} from 'components/typography';

import { COMMON_PAGE_PROPS } from 'variables';

const styles = makeStyles((theme) => ({
  main: {
    padding: theme.spacing(2),
  },
}));

function ExamplesPage({ data, location }) {
  const classes = styles();

  return (
    <Layout
      location={location}
      showBackButton={false}
      title="Examples"
    >
      <main className={classes.main}>
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

