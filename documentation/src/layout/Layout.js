/**
 * See: https://philipwalton.com/articles/normalizing-cross-browser-flexbox-bugs/
 */
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Fragment, useContext } from 'react';

import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import { isWidthUp } from '@material-ui/core/withWidth';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import Footer from 'layout/Footer';
import Header from 'layout/Header';

import AppContext from 'AppContext';

import SEO from './seo';

const styles = makeStyles((theme) => ({
  rootContainer: {
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    minHeight: `calc(100vh - ${theme.appbar.height}px)`,
  },

  fixedHeaderRootContainer: {
    minHeight: '100vh',
    paddingTop: theme.appbar.height,
  },

  contentContainer: {
    flex: 1,
  },

  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),

    '@media print': {
      display: 'none',
    },
  },
}));


const Layout = (props) => {
  const classes = styles();

  const {
    children,
    contentContainerClassName,
    navLinkArrangement,
    rootContainerClassName,
    showBackButton,
  } = props;

  const context = useContext(AppContext);
  const { breakpoint } = context;
  const isWidthMediumUp = isWidthUp('md', breakpoint);

  let fixedHeader = props.fixedHeader;
  if (fixedHeader === undefined) {
    fixedHeader = isWidthMediumUp;
  }

  const rootContainerClasses = [classes.rootContainer, rootContainerClassName];
  if (fixedHeader) {
    rootContainerClasses.push(classes.fixedHeaderRootContainer);
  }

  let headerNavLinkArrangement = [];
  if (navLinkArrangement) {
    headerNavLinkArrangement = navLinkArrangement;
  }


  let fabButton = null;

  if (!isWidthMediumUp && showBackButton) {
    fabButton = (
      <Zoom
        in
        style={{ transitionDelay: `1500ms` }}
        unmountOnExit
      >
        <Fab
          aria-label="Back Button"
          className={classes.fab}
          onClick={() => window.history.back()}
        >
          <ChevronLeftIcon fontSize="large" />
        </Fab>
      </Zoom>
    );
  }



  return (
    <Fragment>
      <SEO title={props.pageTitle || props.title} />

      <Header
        fixed={fixedHeader}
        isWidthMediumUp={isWidthMediumUp}
        loading={props.loading}
        navLinkArrangement={headerNavLinkArrangement}
        showBackButton={showBackButton}
        title={props.title}
      />

      <Container
        className={clsx(rootContainerClasses)}
        disableGutters
        maxWidth={props.maxWidth}
      >
        <div className={clsx(classes.contentContainer, contentContainerClassName)}>
          {children}
        </div>

        <Footer />
      </Container>

      {fabButton}
    </Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
  contentContainerClassName: PropTypes.string,
  fixedHeader: PropTypes.bool,
  loading: PropTypes.bool,
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  mainProps: PropTypes.object,
  navLinkArrangement: PropTypes.array,
  pageTitle: PropTypes.string,
  rootContainerClassName: PropTypes.string,
  showBackButton: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

Layout.defaultProps = {
  fixedHeader: true,
  showBackButton: true,
  loading: false,
  mainProps: {},
  maxWidth: 'md',
};

export default Layout;
