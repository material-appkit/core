import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

import { staticUrl } from 'util/shortcuts';

const styles = makeStyles((theme) => ({
  drawerMenuButton: {
    color: theme.palette.common.white,
  },

  drawerModal: {
    zIndex: `${theme.zIndex.appBar + 1} !important`,
  },

  drawerPaper: {
    backgroundColor: theme.palette.grey[50],
    paddingTop: theme.topbar.height,
    width: theme.sidebar.width,
    zIndex: theme.zIndex.appBar,
  },

  listItemIcon: {
    marginRight: theme.spacing(1),
    minWidth: 'unset',
  },
}));


function ApplicationMenuControl(props) {
  const classes = styles();

  const [mobileOpen, setMobileOpen] = useState(false);

  const { navLinkArrangement } = props;

  return (
    <Fragment>
      <IconButton
        edge="start"
        className={classes.drawerMenuButton}
        onClick={() => { setMobileOpen(true); }}
      >
        <Avatar src={staticUrl('favicon-32x32.png')} />
      </IconButton>

      <Drawer
        anchor="left"
        classes={{
          modal: classes.drawerModal,
          paper: classes.drawerPaper,
        }}
        ModalProps={{ keepMounted: true }}
        open={mobileOpen}
        onClose={() => { setMobileOpen(false); }}
        variant="temporary"
      >
        <List disablePadding>
          {navLinkArrangement.map((linkInfo) => {
            const listItemProps = {};

            if (linkInfo.path) {
              listItemProps.to = linkInfo.path;
              listItemProps.component = RouterLink;
            }

            const handleListItemClick = () => {
              setMobileOpen(false);

              if (linkInfo.onClick) {
                linkInfo.onClick();
              }
            };

            return (
              <ListItem
                button
                divider
                key={linkInfo.title}
                onClick={handleListItemClick}
                {...listItemProps}
              >
                <ListItemIcon className={classes.listItemIcon}>
                  <linkInfo.Icon />
                </ListItemIcon>

                <ListItemText
                  primary={linkInfo.title}
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </Fragment>
  );
}

ApplicationMenuControl.propTypes = {
  navLinkArrangement: PropTypes.array,
};

export default ApplicationMenuControl;
