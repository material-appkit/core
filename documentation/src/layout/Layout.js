/**
 * See: https://philipwalton.com/articles/normalizing-cross-browser-flexbox-bugs/
 */
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Fragment, useContext, useState } from 'react';

import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';
import Hidden from '@material-ui/core/Hidden';
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

    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.navbar.width,

      transition: theme.transitions.create(['padding'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },

  rootContainerShift: {
    paddingLeft: 0,

    transition: theme.transitions.create(['padding'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  fixedHeaderRootContainer: {
    minHeight: '100vh',
    paddingTop: theme.appbar.height,
  },

  contentContainer: {
    flex: 1,
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
    fixedHeader,
    location,
    rootContainerClassName,
    showBackButton,
  } = props;

  const context = useContext(AppContext);
  const { breakpoint } = context;

  const isWidthMediumUp = breakpoint ? isWidthUp('md', breakpoint) : true;

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(true);

  const rootContainerClasses = [classes.rootContainer, rootContainerClassName];
  if (fixedHeader) {
    rootContainerClasses.push(classes.fixedHeaderRootContainer);
  }
  if (!desktopDrawerOpen) {
    rootContainerClasses.push(classes.rootContainerShift);
  }

  const handleApplicationLogoClick = () => {
    if (isWidthMediumUp) {
      setDesktopDrawerOpen(!desktopDrawerOpen);
    } else {
      setMobileDrawerOpen(!mobileDrawerOpen);
    }
  };

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

  const applicationNavTree = <ApplicationNavTree location={location} />;

  return (
    <Fragment>
      <SEO title={props.pageTitle || props.title} />

      {fabButton}

      <Header
        fixed={fixedHeader}
        isWidthMediumUp={isWidthMediumUp}
        loading={props.loading}
        onApplicationLogoClick={handleApplicationLogoClick}
        showBackButton={showBackButton}
        title={props.title}
      />

      <div className={clsx(rootContainerClasses)}>
        <div className={clsx(classes.contentContainer, contentContainerClassName)}>
          {children}
        </div>

        <Footer />
      </div>

      <Hidden mdUp implementation="js" initialWidth="xs">
        <Drawer
          anchor="left"
          classes={{
            modal: classes.drawerModal,
            paper: classes.drawerPaper,
          }}
          ModalProps={{ keepMounted: true }}
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          variant="temporary"
        >
          {applicationNavTree}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor="left"
          classes={{ paper: classes.drawerPaper }}
          variant="persistent"
          open={desktopDrawerOpen}
        >
          {applicationNavTree}
        </Drawer>
      </Hidden>
    </Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
  contentContainerClassName: PropTypes.string,
  fixedHeader: PropTypes.bool,
  loading: PropTypes.bool,
  location: PropTypes.object.isRequired,
  pageTitle: PropTypes.string,
  rootContainerClassName: PropTypes.string,
  showBackButton: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};

Layout.defaultProps = {
  fixedHeader: true,
  showBackButton: true,
  loading: false,
};

export default Layout;
