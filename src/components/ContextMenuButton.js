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
    anchorOrigin,
    buttonProps,
    contextMenuProps,
    dense,
    Icon,
    iconClassName,
    label,
    menuItemArrangement,
    representedObject,
    transformOrigin,
  } = props;

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const menu = useMemo(() => {
    if (!(menuAnchorEl && menuItemArrangement)) {
      return null;
    }

    let menuItems;
    if (typeof(menuItemArrangement) === 'function') {
      menuItems = menuItemArrangement(representedObject);
    } else {
      menuItems = menuItemArrangement;
    }

    return (
      <ContextMenu
        anchorEl={menuAnchorEl}
        anchorOrigin={anchorOrigin}
        dense={dense}
        getContentAnchorEl={null}
        menuItemArrangement={menuItems}
        open
        onClose={() => setMenuAnchorEl(null)}
        transformOrigin={transformOrigin}
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
  
  let control;
  if (label) {
    control = (
      <Button
        endIcon={<ExpandMoreIcon />}
        onClick={(e) => setMenuAnchorEl(e.target)}
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
        onClick={(e) => setMenuAnchorEl(e.target)}
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
  anchorOrigin: PropTypes.object,
  buttonProps: PropTypes.object,
  contextMenuProps: PropTypes.object,
  dense: PropTypes.bool,
  Icon: PropTypes.elementType,
  iconClassName: PropTypes.string,
  label: PropTypes.string,
  menuItemArrangement: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
  ]),
  representedObject: PropTypes.object,
  transformOrigin: PropTypes.object,
};

ContextMenuButton.defaultProps = {
  anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
  buttonProps: {},
  contextMenuProps: {},
  dense: false,
  Icon: MoreVertIcon,
  transformOrigin: { vertical: 'top', horizontal: 'left' },
};

export default ContextMenuButton;
