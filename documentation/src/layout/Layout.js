/**
 * See: https://philipwalton.com/articles/normalizing-cross-browser-flexbox-bugs/
 */
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Fragment, useContext, useState } from 'react';

import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import { makeStyles } from '@material-ui/core/styles';
import { isWidthUp } from '@material-ui/core/withWidth';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import Footer from './Footer';
import Header from './Header';

import AppContext from 'AppContext';

import ApplicationNavTree from './ApplicationNavTree';
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

    [theme.breakpoints.up('md')]: {
      marginLeft: theme.navbar.width,
    },
  },

  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),

    '@media print': {
      display: 'none',
    },
  },

  drawerModal: {
    zIndex: `${theme.zIndex.appBar - 1} !important`,
  },

  drawerPaper: {
    backgroundColor: theme.palette.grey[50],
    paddingTop: theme.appbar.height,
    width: theme.navbar.width,

    [theme.breakpoints.up('md')]: {
      zIndex: `${theme.zIndex.appBar - 1}`,
    },
  },
}));


const Layout = (props) => {
  const classes = styles();

  const {
    children,
    contentContainerClassName,
    fixedHeader,
    rootContainerClassName,
    showBackButton,
  } = props;

  const context = useContext(AppContext);
  const { breakpoint } = context;

  const isWidthMediumUp = breakpoint ? isWidthUp('md', breakpoint) : true;

  const [drawerOpen, setDrawerOpen] = useState(false);


  const rootContainerClasses = [classes.rootContainer, rootContainerClassName];
  if (fixedHeader) {
    rootContainerClasses.push(classes.fixedHeaderRootContainer);
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


  const drawer = (
    <Drawer
      anchor="left"
      classes={{
        modal: classes.drawerModal,
        paper: classes.drawerPaper,
      }}
      ModalProps={{ keepMounted: true }}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      variant={isWidthMediumUp ? 'permanent' : 'temporary'}
    >
      <ApplicationNavTree location={props.location} />
    </Drawer>
  );

  return (
    <Fragment>
      <SEO title={props.pageTitle || props.title} />

      <Header
        fixed={fixedHeader}
        isWidthMediumUp={isWidthMediumUp}
        loading={props.loading}
        onApplicationLogoClick={() => setDrawerOpen(!drawerOpen)}
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

      {drawer}
      {fabButton}
    </Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
  contentContainerClassName: PropTypes.string,
  fixedHeader: PropTypes.bool,
  loading: PropTypes.bool,
  location: PropTypes.object.isRequired,
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  mainProps: PropTypes.object,
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
  maxWidth: 'xl',
};

export default Layout;
