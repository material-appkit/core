import PropTypes from 'prop-types';
import React from 'react';

import { Link as RouterLink } from 'react-router-dom';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
    dense,
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
        const menuItemProps = {
          onClick: (e) => { handleMenuItemClick(e, menuItemInfo); }
        };

        if (menuItemInfo.href) {
          menuItemProps.component = Link;
          menuItemProps.href = menuItemInfo.href;
          menuItemProps.target= '_blank';
          menuItemProps.rel = 'noopener noreferrer';
        }

        if (menuItemInfo.link) {
          menuItemProps.to = menuItemInfo.link;
          menuItemProps.component = RouterLink;
        }

        return (
          <MenuItem
            dense={dense}
            key={menuItemInfo.key}
            {...menuItemProps}
          >
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
  dense: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  menuItemArrangement: PropTypes.array.isRequired,
};

ContextMenu.defaultProps = {
  dense: true,
};
export default ContextMenu;
