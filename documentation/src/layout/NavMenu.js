import PropTypes from 'prop-types';
import React, { Fragment, useCallback, useState } from 'react';
import { Link as GatsbyLink } from 'gatsby';

import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

const styles = makeStyles((theme) => ({
  drawerPaper: {
    backgroundColor: theme.palette.grey[50],
    width: theme.navbar.width,
    zIndex: theme.zIndex.appBar,
  },

  menuButton: {
    '@media print': {
      display: 'none',
    },
  },

  listItemIcon: {
    minWidth: theme.spacing(4),
  },

  listItemText: {
    marginBottom: 0,
  },
}));

function NavMenu(props) {
  const classes = styles();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggleButtonClick = useCallback(() => {
    setMobileOpen(true);
  }, []);

  return (
    <Fragment>
      <IconButton
        className={classes.menuButton}
        onClick={handleDrawerToggleButtonClick}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        classes={{ paper: classes.drawerPaper }}
        ModalProps={{ keepMounted: true }}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant="temporary"
      >
        <List disablePadding>
          {props.navLinkArrangement.map((linkInfo) => {
            const {
              href,
              Icon,
              onClick,
              path,
              title
            } = linkInfo;

            let listItemIcon = null;
            if (Icon) {
              listItemIcon = (
                <ListItemIcon className={classes.listItemIcon}>
                  <Icon />
                </ListItemIcon>
              );
            }

            const listItemProps = {};
            if (path) {
              listItemProps.to = path;
              listItemProps.component = GatsbyLink;
            }
            if (href) {
              listItemProps.href = href;
              listItemProps.target = '_blank';
              listItemProps.rel = 'noopener';
            }
            if (onClick) {
              listItemProps.onClick = onClick;
            }

            return (
              <ListItem
                button
                divider
                key={title}
                {...listItemProps}
              >
                {listItemIcon}
                <ListItemText
                  className={classes.listItemText}
                  primary={title}
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </Fragment>
  );
}

NavMenu.propTypes = {
  navLinkArrangement: PropTypes.array.isRequired,
};

export default NavMenu;
