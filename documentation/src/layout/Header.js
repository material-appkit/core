import PropTypes from 'prop-types';
import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { makeStyles } from '@material-ui/core/styles';
import GitHubIcon from '@material-ui/icons/GitHub';

import ApplicationLogo from 'images/application-logo.svg';
import NpmLogo from 'images/npm-logo.png';

import TopNavbar from './TopNavbar';
import NavMenu from './NavMenu';


const styles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.common.white,
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    flexShrink: 0,
    height: theme.appbar.APP_BAR_HEIGHT,
    zIndex: theme.zIndex.appBar + 1,
  },

  toolBar: {
    justifyContent: 'space-between',
    minHeight: theme.appbar.height,
    paddingLeft: theme.spacing(1),
  },

  applicationLogoButton: {
    width: 48,
    height: 48,
  },

  pageTitle: {
    fontSize: theme.typography.pxToRem(20),
  },

  loadingIndicator: {
    height: 2,
    marginTop: -2,
  },
}));

const Header = (props) => {
  const classes = styles();

  const {
    fixed,
    isWidthMediumUp,
    onApplicationLogoClick,
    title,
  } = props;

  const trigger = useScrollTrigger();

  const navLinkArrangement = [{
    title: 'Published Build',
    image: NpmLogo,
    href: 'https://www.npmjs.com/package/@material-appkit/core',
  }, {
    title: 'Public Repository',
    Icon: GitHubIcon,
    href: 'https://github.com/allanhart/material-appkit',
  }];

  let view = (
    <AppBar
      className={classes.appBar}
      color="default"
      elevation={0}
      position={fixed ? 'fixed' : 'relative'}
    >
      <Toolbar className={classes.toolBar} disableGutters>
        <Box display="flex" alignItems="center">
          <IconButton
            className={classes.applicationLogoButton}
            onClick={onApplicationLogoClick}
          >
            <img src={ApplicationLogo} width="36" />
          </IconButton>

          <Box marginLeft={1}>
            <Typography component="h1" className={classes.pageTitle}>
              {title}
            </Typography>
          </Box>
        </Box>

        <Hidden mdUp>
          <NavMenu navLinkArrangement={navLinkArrangement} />
        </Hidden>
        <Hidden smDown>
          <TopNavbar navLinkArrangement={navLinkArrangement} />
        </Hidden>
      </Toolbar>

      {props.loading &&
        <LinearProgress className={classes.loadingIndicator} />
      }
    </AppBar>
  );

  if (!isWidthMediumUp) {
    view = (
      <Slide appear={false} direction="down" in={!trigger}>
        {view}
      </Slide>
    )
  }

  return view;
};

Header.propTypes = {
  fixed: PropTypes.bool.isRequired,
  isWidthMediumUp: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onApplicationLogoClick: PropTypes.func.isRequired,
  showBackButton: PropTypes.bool.isRequired,
  title: PropTypes.string,
};

export default Header;
