import PropTypes from 'prop-types';
import React, { Fragment, useCallback, useRef, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ContextMenu from './ContextMenu';

function ContextMenuButton(props) {
  const {
    buttonProps,
    dense,
    Icon,
    iconClassName,
    menuItemArrangement,
  } = props;

  const menuAnchorRef = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const handleContextMenuClose = useCallback((event) => {
    if (menuAnchorRef.current && menuAnchorRef.current.contains(event.target)) {
      return;
    }
    setMenuIsOpen(false);
  }, []);

  if (!(menuItemArrangement && menuItemArrangement.length)) {
    return null;
  }

  return (
    <Fragment>
      <IconButton
        aria-owns={menuIsOpen ? 'context-menu' : undefined}
        aria-haspopup="true"
        onClick={(e) => setMenuIsOpen(true)}
        ref={menuAnchorRef}
        {...buttonProps}
      >
        <Icon className={iconClassName} />
      </IconButton>

      <ContextMenu
        anchorEl={menuAnchorRef.current}
        dense={dense}
        menuItemArrangement={menuItemArrangement}
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
  Icon: PropTypes.elementType,
  iconClassName: PropTypes.string,
  menuItemArrangement: PropTypes.array,
};

ContextMenuButton.defaultProps = {
  buttonProps: {},
  dense: false,
  Icon: MoreVertIcon,
};

export default React.memo(ContextMenuButton);
