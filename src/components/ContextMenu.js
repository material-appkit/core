import PropTypes from 'prop-types';
import React from 'react';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  contextMenuContent: {
    alignItems: 'center',
    display: 'flex',
  },

  listItemIcon: {
    minWidth: 'initial',
  },

  icon: {
    marginRight: theme.spacing(1),
  },
}));

function ContextMenu(props) {
  const {
    menuItemArrangement,
    menuItemProps,
    ...menuProps
  } = props;

  const handleMenuItemClick = (e, menuItemInfo) => {
    props.onClose(e);

    if (menuItemInfo.onClick) {
      menuItemInfo.onClick();
    }
  };

  const classes = styles();

  return (
    <Menu {...menuProps}>
      {menuItemArrangement.map((menuItemInfo) => {
        const allMenuItemProps = {
          ...menuItemProps,
          onClick: (e) => { handleMenuItemClick(e, menuItemInfo); }
        };
        if (menuItemInfo.href) {
          allMenuItemProps.component = Link;
          allMenuItemProps.href = menuItemInfo.href;
          allMenuItemProps.target= '_blank';
          allMenuItemProps.rel = 'noopener noreferrer';
        }

        if (menuItemInfo.link) {
          allMenuItemProps.to = menuItemInfo.link;
          allMenuItemProps.component = Link;
        }

        return (
          <MenuItem key={menuItemInfo.key} {...allMenuItemProps}>
            {menuItemInfo.icon &&
              <ListItemIcon className={classes.listItemIcon}>
                <menuItemInfo.icon className={classes.icon} />
              </ListItemIcon>
            }
            {menuItemInfo.title}
          </MenuItem>
        );
      })}
    </Menu>
  );
}

ContextMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
  menuItemArrangement: PropTypes.array.isRequired,
  menuItemProps: PropTypes.object,
};

ContextMenu.defaultProps = {
  menuItemProps: { }
};

export default ContextMenu;
