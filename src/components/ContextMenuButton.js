import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ContextMenu from './ContextMenu';

function ContextMenuButton(props) {
  const {
    buttonProps,
    contextMenuProps,
    dense,
    Icon,
    iconClassName,
    label,
    menuItemArrangement,
    representedObject,
  } = props;

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const menu = useMemo(() => {
    if (!(menuAnchorEl && menuItemArrangement)) {
      return null;
    }

    const menuItems = menuItemArrangement(representedObject);

    return (
      <ContextMenu
        anchorEl={menuAnchorEl}
        dense={dense}
        getContentAnchorEl={null}
        open
        onClose={() => setMenuAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        menuItemArrangement={menuItems}
        {...contextMenuProps}
      />
    );
  }, [
    contextMenuProps,
    dense,
    menuItemArrangement,
    menuAnchorEl,
    representedObject
  ]);


  if (!menuItemArrangement) {
    return null;
  }

  let control;
  if (label) {
    control = (
      <Button
        endIcon={<ExpandMoreIcon />}
        onClick={() => setMenuIsOpen(true)}
        ref={menuAnchorRef}
        {...buttonProps}
      >
        <Typography noWrap variant="button">
          {label}
        </Typography>
      </Button>
    );
  } else {
    control = (
      <IconButton
        onClick={(e) => setMenuAnchorEl(menuAnchorEl ? null : e.target)}
        {...buttonProps}
      >
        <Icon className={iconClassName} />
      </IconButton>
    );
  }

  return (
    <>
      {control}
      {menu}
    </>
  );
}

ContextMenuButton.propTypes = {
  buttonProps: PropTypes.object,
  contextMenuProps: PropTypes.object,
  dense: PropTypes.bool,
  Icon: PropTypes.elementType,
  iconClassName: PropTypes.string,
  label: PropTypes.string,
  menuItemArrangement: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
  representedObject: PropTypes.object,
};

ContextMenuButton.defaultProps = {
  buttonProps: {},
  contextMenuProps: {},
  dense: false,
  Icon: MoreVertIcon,
};

export default ContextMenuButton;
