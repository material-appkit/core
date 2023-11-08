import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';

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
        onClick={() => setMenuIsOpen(true)}
        ref={menuAnchorRef}
        {...buttonProps}
      >
        <Icon className={iconClassName} />
      </IconButton>
    );
  }

  return (
    <>
      {control}

      <ContextMenu
        anchorEl={menuAnchorRef.current}
        dense={dense}
        getContentAnchorEl={null}
        menuItemArrangement={menuItemArrangement}
        onClose={handleContextMenuClose}
        open={menuIsOpen}
        {...contextMenuProps}
      />
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
  menuItemArrangement: PropTypes.array,
};

ContextMenuButton.defaultProps = {
  buttonProps: {},
  contextMenuProps: {},
  dense: false,
  Icon: MoreVertIcon,
};

export default React.memo(ContextMenuButton);
