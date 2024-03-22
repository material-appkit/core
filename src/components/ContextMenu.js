import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';


const styles = makeStyles((theme) => ({
  fileInput: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0,
    opacity: 0,
  },

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

      const {
        disabled,
        fileInput,
        fileInputProps,
        href,
        icon,
        onClick,
        onFileSelect,
        title,
      } = menuItemInfo;

      let menuItemIcon = null;
      if (icon) {
        const Icon = icon;
        menuItemIcon = (
          <ListItemIcon className={classes.listItemIcon}>
            <Icon className={classes.icon} />
          </ListItemIcon>
        );
      }

      const menuItemProps = {
        dense,
        disabled,
        key: menuItemKey,
        onClick: () => {
          // If the menu item presents a file chooser, we cannot immediately close it
          // when the menu item is clicked or else the file input will be destroyed
          // and we can not receive its 'change' event.
          // In this case, the input change handler will close the menu.
          if (!fileInput) {
            onClose();
          }

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
        <MenuItem
          className={classes.menuItem}
          {...menuItemProps}
        >
          {menuItemIcon}

          {(fileInput && onFileSelect) && (
            <input {...(fileInputProps || {})}
              type="file"
              className={classes.fileInput}
              onChange={(e) => {
                const input = e.target;
                const selectedFiles = Array.from(input.files);
                onFileSelect(selectedFiles);

                // Clear the file input value so that selecting the same file(s) again
                // will result in another change event
                input.value = null;
                onClose();
              }}
            />
          )}

          <ListItemText primary={title} />
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
