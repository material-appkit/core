import PropTypes from 'prop-types';
import React from 'react';

import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  divider: {
    width: '100%',
  },

  listItemIcon: {
    minWidth: 'initial',
  },

  icon: {
    marginRight: theme.spacing(1),
  },
}));

function ContextMenu(props) {
  const classes = styles();

  const { dense, menuItemArrangement, ...menuProps } = props;

  const handleMenuItemClick = (e, menuItemInfo) => {
    props.onClose(e);

    if (menuItemInfo.onClick) {
      menuItemInfo.onClick();
    }
  };


  return (
    <Menu {...menuProps}>
      {menuItemArrangement.map((menuItemInfo, menuItemIndex) => {
        const menuItemKey = `menuitem-${menuItemIndex}`;

        if (menuItemInfo === '---') {
          return (
            <MenuItem key={menuItemKey} button={false}>
              <Divider
                className={classes.divider}
                variant="fullWidth"
              />
            </MenuItem>
          );
        }

        const menuItemProps = {
          dense,
          disabled: menuItemInfo.disabled,
          key: menuItemKey,
          onClick: (e) => {
            handleMenuItemClick(e, menuItemInfo);
          },
        };

        if (menuItemInfo.href) {
          menuItemProps.component = Link;
          menuItemProps.href = menuItemInfo.href;
          menuItemProps.target= '_blank';
          menuItemProps.rel = 'noopener noreferrer';
        }

        let menuItem = (
          <MenuItem {...menuItemProps}>
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
            <Tooltip
              key={menuItemKey}
              title={menuItemInfo.tooltip}
            >
              <div>{menuItem}</div>
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
