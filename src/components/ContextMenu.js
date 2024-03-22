import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';


const styles = makeStyles((theme) => ({
  divider: {
    width: '100%',
  },

  listItemIcon: {
    marginRight: theme.spacing(1),
  },
}));

function ContextMenu(props) {
  const classes = styles();

  const { dense, menuItemArrangement, ...menuProps } = props;
  const onClose = props.onClose;


  const menuItems = useMemo(() => {
    return menuItemArrangement.map((menuItemInfo, menuItemIndex) => {
      const menuItemKey = `menuitem-${menuItemIndex}`;

      if (menuItemInfo === '---') {
        return (
          <MenuItem
            button={false}
            dense
            key={menuItemKey}
          >
            <Divider className={classes.divider} />
          </MenuItem>
        );
      }

      const { disabled, href, icon, onClick, title } = menuItemInfo;

      let menuItemIcon = null;
      if (icon) {
        const Icon = icon;
        menuItemIcon = (
          <ListItemIcon className={classes.listItemIcon}>
            <Icon className={classes.icon} />
          </ListItemIcon>
        )
      }

      const menuItemProps = {
        dense,
        disabled,
        key: menuItemKey,
        onClick: (e) => {
          onClose(e);

          if (onClick) {
            onClick(menuItemIndex);
          }
        },
      };

      if (href) {
        menuItemProps.component = Link;
        menuItemProps.href = href;
        menuItemProps.target= '_blank';
        menuItemProps.rel = 'noopener noreferrer';
      }

      return (
        <MenuItem {...menuItemProps}>
          {menuItemIcon}
          {title}
        </MenuItem>
      );
    });
  }, [dense, menuItemArrangement, onClose]);

  return (
    <Menu {...menuProps}>
      {menuItems}
    </Menu>
  );
}

ContextMenu.propTypes = {
  dense: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  menuItemArrangement: PropTypes.array.isRequired,
  TransitionComponent: PropTypes.elementType,
};

ContextMenu.defaultProps = {
  dense: false,
  TransitionComponent: Fade,

};

export default ContextMenu;
