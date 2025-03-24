import PropTypes from 'prop-types';

import React, { useMemo, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import ContextMenu from "./ContextMenu";


function ListViewActionMenuControl({ getMenuItemArrangement, selection }) {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);


  const menu = useMemo(() => {
    if (!(menuAnchorEl && getMenuItemArrangement)) {
      return null;
    }

    const menuItemArrangement = getMenuItemArrangement(selection);

    return (
      <ContextMenu
        anchorEl={menuAnchorEl}
        getContentAnchorEl={null}
        open
        onClose={() => setMenuAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        menuItemArrangement={menuItemArrangement}
      />
    );
  }, [getMenuItemArrangement, menuAnchorEl, selection]);

  return (
    <>
      <IconButton
        color="primary"
        disabled={!selection.size}
        onClick={(e) => setMenuAnchorEl(menuAnchorEl ? null : e.target)}
        style={{ borderRadius: 0 }}
      >
        <MoreVertIcon />
      </IconButton>

      {menu}
    </>
  );
}

ListViewActionMenuControl.propTypes = {
  getMenuItemArrangement: PropTypes.func.isRequired,
  selection: PropTypes.object.isRequired,
};

export default ListViewActionMenuControl;

