import React from 'react';
import { graphql } from 'gatsby';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Layout from 'layout/Layout';

import CodeView from 'components/CodeView';

import ApplicationLogo from 'media/application-logo.svg';
import { ContentHeading } from 'components/typography';
import { COMMON_PAGE_PROPS } from 'variables';
import { fileContent } from 'util/shortcuts';

const styles = makeStyles((theme) => ({
  contentContainer: {
    margin: 'auto',
    padding: theme.spacing(6, 2, 2),
  },

  header: {
    marginBottom: 32,
    textAlign: 'center',
  },

  title: {
    fontSize: theme.typography.pxToRem(28),
    letterSpacing: '0.5rem',
    marginTop: theme.spacing(2),
    textTransform: 'uppercase',
  },

  version: {
    fontSize: theme.typography.pxToRem(20),
    letterSpacing: '0.2rem',
  },

  instructionSection: {
    backgroundColor: '#f5f5f5',
    height: '100%',
    padding: theme.spacing(0, 2),
  },

  instructionArticle: {
    padding: theme.spacing(2, 0),
  }
}));


function HomePage(props) {
  const classes = styles();

  const samples = props.data.samples.nodes;
  console.log(fileContent(samples, 'quickstart.sh'));

  return (
    <Layout
      contentContainerClassName={classes.contentContainer}
      showBackButton={false}
      title="Introduction"
      {...props}
    >
      <main className={classes.main}>
        <header className={classes.header}>
          <img alt="Material-AppKit Logo" src={ApplicationLogo} width="300" />

          <Typography component="h1" color="primary" className={classes.title}>
            {process.env.GATSBY_APP_TITLE}
          </Typography>

          <Typography component="h2" className={classes.version}>
            v{process.env.GATSBY_APP_VERSION}
          </Typography>
        </header>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <section className={classes.instructionSection}>
              <article className={classes.instructionArticle}>
                <ContentHeading gutterBottom>
                  Installation
                </ContentHeading>
                <Typography>
                  Install Material-AppKit via npm:
                </Typography>
                <CodeView language="bash">
                  $ npm install @material-appkit/core
                </CodeView>
              </article>

              <article className={classes.instructionArticle}>
                <ContentHeading gutterBottom>
                  Quickstart
                </ContentHeading>
                <Typography>
                  Start coding immediately using one of the following project templates:
                </Typography>
                <CodeView language="bash">
                  {fileContent(samples, 'quickstart.sh')}
                </CodeView>
              </article>
            </section>
          </Grid>

          <Grid item xs={12} md={6}>
            <section className={classes.instructionSection}>
              <article className={classes.instructionArticle}>
                <ContentHeading gutterBottom>
                  Usage
                </ContentHeading>
                <Typography>
                  Import components and utilities as you would any other
                  Material-UI component or function.
                </Typography>
                <CodeView language="jsx">
                  {fileContent(samples, 'usage-example.jsx')}
                </CodeView>
              </article>
            </section>
          </Grid>
        </Grid>
      </main>
    </Layout>
  );
}

HomePage.propTypes = COMMON_PAGE_PROPS;

export default HomePage;


export const query = graphql`
  query {
    samples: allFile(filter: {relativeDirectory: {eq: "samples/index"}}) {
      nodes {
        base
        internal {
          content
        }
      }
    }  
  }
`;
