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

function ReferencePage({ data, location }) {
  const classes = styles();

  return (
    <Layout
      location={location}
      showBackButton={false}
      title="API Reference"
    >
      <main className={classes.main}>
        <PageTitle>
          API Reference
        </PageTitle>

        <ContentSection>
          <ContentHeading>
            Components
          </ContentHeading>
        </ContentSection>

        <ContentSection>
          <ContentHeading>
            Managers
          </ContentHeading>
        </ContentSection>

        <ContentSection>
          <ContentHeading>
            Utilities
          </ContentHeading>
        </ContentSection>
      </main>
    </Layout>
  );
}

ReferencePage.propTypes = COMMON_PAGE_PROPS;

export default ReferencePage;

