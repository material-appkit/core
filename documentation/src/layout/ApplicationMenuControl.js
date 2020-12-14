import PropTypes from 'prop-types';

import React, { Fragment, useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import Img from 'gatsby-image';

import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';

import ApplicationNavTree from './ApplicationNavTree';



const styles = makeStyles((theme) => ({
  drawerModal: {
    zIndex: `${theme.zIndex.appBar} !important`,
  },

  drawerPaper: {
    backgroundColor: theme.palette.grey[50],
    paddingTop: theme.appbar.height,
    width: theme.sidebar.width,
  },

  listItemIcon: {
    marginRight: theme.spacing(1),
    minWidth: 'unset',
  },
}));


function ApplicationMenuControl(props) {
  const { applicationLogo } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
        
        applicationLogo: file(relativePath: { eq: "application-logo.png" }) {
          childImageSharp {
            fixed(width: 40, height: 40) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    `
  );

  const classes = styles();

  const [drawerOpen, setDrawerOpen] = useState(false);


  return (
    <Fragment>
      <IconButton
        className={classes.drawerMenuButton}
        onClick={() => setDrawerOpen(!drawerOpen)}
        size="small"
      >
        <Img fixed={applicationLogo.childImageSharp.fixed} />
      </IconButton>

      <Drawer
        anchor="left"
        classes={{
          modal: classes.drawerModal,
          paper: classes.drawerPaper,
        }}
        ModalProps={{ keepMounted: true }}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant="temporary"
      >
        <ApplicationNavTree
          location={props.location}
        />
      </Drawer>
    </Fragment>
  );
}

ApplicationMenuControl.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ApplicationMenuControl;
