import PropTypes from 'prop-types';

import React, { useCallback, useState } from 'react';

import Fade from '@material-ui/core/Fade';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';


import { makeChoices } from "../util/array";


function ListViewActionMenuControl(props) {
  console.log(props);

  return (
    <>
      <IconButton
        color="primary"
        // onClick={(e) => setSortControlEl(e.currentTarget)}
        style={{ borderRadius: 0 }}
      >
        <MoreVertIcon />
      </IconButton>

      {/*<Menu*/}
      {/*  anchorEl={sortControlEl}*/}
      {/*  getContentAnchorEl={null}*/}
      {/*  open={Boolean(sortControlEl)}*/}
      {/*  onClose={dismissMenu(null)}*/}
      {/*  anchorOrigin={{*/}
      {/*    vertical: 'bottom',*/}
      {/*    horizontal: 'center',*/}
      {/*  }}*/}
      {/*  transformOrigin={{*/}
      {/*    vertical: 'top',*/}
      {/*    horizontal: 'center',*/}
      {/*  }}*/}
      {/*  TransitionComponent={Fade}*/}
      {/*>*/}
      {/*  {makeChoices(choices).map((sortChoice, choiceIndex) => {*/}
      {/*    let selected;*/}
      {/*    if (activeOrdering) {*/}
      {/*      selected = sortChoice.value === activeOrdering;*/}
      {/*    } else {*/}
      {/*      selected = choiceIndex === 0;*/}
      {/*    }*/}

      {/*    return (*/}
      {/*      <MenuItem*/}
      {/*        key={sortChoice.value}*/}
      {/*        onClick={dismissMenu(sortChoice)}*/}
      {/*        selected={selected}*/}
      {/*      >*/}
      {/*        <ListItemIcon>*/}
      {/*          {selected ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon /> }*/}
      {/*        </ListItemIcon>*/}

      {/*        {sortChoice.label}*/}
      {/*      </MenuItem>*/}
      {/*    );*/}
      {/*  })}*/}
      {/*</Menu>*/}
    </>
  );
}

ListViewActionMenuControl.propTypes = {

};

export default ListViewActionMenuControl;

