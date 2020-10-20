import PropTypes from 'prop-types';
import React, { Fragment, useRef, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ContextMenu from './ContextMenu';

function ContextMenuButton(props) {
  const menuAnchorRef = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const handleContextMenuClose = (event) => {
    if (menuAnchorRef.current && menuAnchorRef.current.contains(event.target)) {
      return;
    }
    setMenuIsOpen(false);
  };

  return (
    <Fragment>
      <IconButton
        aria-owns={menuIsOpen ? 'context-menu' : undefined}
        aria-haspopup="true"
        onClick={(e) => { setMenuIsOpen(true); }}
        ref={menuAnchorRef}
        {...props.buttonProps}
      >
        <props.icon className={props.iconClassName} />
      </IconButton>
      <ContextMenu
        anchorEl={menuAnchorRef.current}
        dense={props.dense}
        menuItemArrangement={props.menuItemArrangement}
        id="context-menu"
        onClose={handleContextMenuClose}
        open={menuIsOpen}
      />
    </Fragment>
  );
}

ContextMenuButton.propTypes = {
  buttonProps: PropTypes.object,
  dense: PropTypes.bool,
  icon: PropTypes.elementType,
  iconClassName: PropTypes.string,
  menuItemArrangement: PropTypes.array.isRequired,
};

ContextMenuButton.defaultProps = {
  buttonProps: {},
  dense: false,
  icon: MoreVertIcon,
};

export default ContextMenuButton;
