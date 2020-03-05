import PropTypes from 'prop-types';
import React from 'react';

import { Link as RouterLink } from 'react-router-dom';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
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
          dense: true,
          disabled: menuItemInfo.disabled,
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

        let menuItem = (
          <MenuItem
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

        if (menuItemInfo.tooltip) {
          menuItem = (
            <Tooltip key={menuItemInfo.key} title={menuItemInfo.tooltip}>
              <div>
                {menuItem}
              </div>
            </Tooltip>
          );
        }

        return menuItem;
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
  dense: false,
};
export default ContextMenu;
