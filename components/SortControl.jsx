import PropTypes from 'prop-types';

import React, { useCallback, useState } from 'react';

import Fade from '@material-ui/core/Fade';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import SortIcon from '@material-ui/icons/Sort';


import { makeChoices } from "../util/array";


function SortControl(props) {
  const {
    choices,
    orderingParamName,
    searchParams,
    setSearchParams,
  } = props;

  let activeOrdering = undefined;
  if (searchParams) {
    activeOrdering = searchParams.get(orderingParamName);
  }

  const [sortControlEl, setSortControlEl] = useState(null);

  const dismissMenu = useCallback((choice) => (e) => {
    if (choice) {
      const updatedSearchParams = new URLSearchParams(searchParams);
      updatedSearchParams.set(orderingParamName, choice.value);
      setSearchParams(updatedSearchParams);
    }
    setSortControlEl(null);
  }, [orderingParamName, searchParams, setSearchParams]);

  return (
    <>
      <IconButton
        color="primary"
        onClick={(e) => setSortControlEl(e.currentTarget)}
        style={{ borderRadius: 0 }}
      >
        <SortIcon />
      </IconButton>

      <Menu
        anchorEl={sortControlEl}
        getContentAnchorEl={null}
        open={Boolean(sortControlEl)}
        onClose={dismissMenu(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        {makeChoices(choices).map((sortChoice, choiceIndex) => {
          let selected;
          if (activeOrdering) {
            selected = sortChoice.value === activeOrdering;
          } else {
            selected = choiceIndex === 0;
          }

          return (
            <MenuItem
              key={sortChoice.value}
              onClick={dismissMenu(sortChoice)}
              selected={selected}
            >
              <ListItemIcon>
                {selected ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon /> }
              </ListItemIcon>

              {sortChoice.label}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

SortControl.propTypes = {
  choices: PropTypes.array.isRequired,
  orderingParamName: PropTypes.string.isRequired,
  searchParams: PropTypes.object,
  setSearchParams: PropTypes.func,
};

export default SortControl;

