import PropTypes from 'prop-types';

import React, { Fragment, useState } from 'react';
import {
  graphql,
  useStaticQuery,
  Link as GatsbyLink
} from 'gatsby';

import Img from 'gatsby-image';

import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

import { applicationNavLinkArrangement } from 'util/shortcuts';


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
  const { context } = props;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const navLinkArrangement = applicationNavLinkArrangement(context);

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
        <List disablePadding>
          {navLinkArrangement.map((linkInfo) => {
            const { Icon, onClick, path, title } = linkInfo;
            const listItemProps = { onClick };

            if (path) {
              listItemProps.to = path;
              listItemProps.component = GatsbyLink;
            }

            return (
              <ListItem
                button
                divider
                key={linkInfo.title}
                {...listItemProps}
              >
                {Icon &&
                  <ListItemIcon className={classes.listItemIcon}>
                    <Icon />
                  </ListItemIcon>
                }

                <ListItemText primary={title} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </Fragment>
  );
}

ApplicationMenuControl.propTypes = {
  context: PropTypes.object.isRequired,
};

export default ApplicationMenuControl;
