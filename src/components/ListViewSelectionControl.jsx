import PropTypes from 'prop-types';

import React, { useCallback, useState } from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';

import ToolbarItem from "./ToolbarItem";


const styles = makeStyles((theme) => ({
  button: {
    padding: theme.spacing(1),
  },

  buttonGroupButton: {
    padding: theme.spacing(0.5, 1),
  },

  menuButton: {
    borderColor: `${theme.palette.grey[400]} !important`,
    minWidth: 0,
    padding: 0,
  },

  disabled: {
    color: theme.palette.text.secondary,
  },

  enabled: {
    color: theme.palette.primary.main,
  },
}));

function ListViewSelectionControl(props) {
  const classes = styles();

  const {
    disableSelectionMenu,
    onSelectionMenuItemClick,
    onToggle,
    selectionDisabled,
  } = props;

  const [selectMenuEl, setSelectMenuEl] = useState(null);

  const tooltip = `Selection mode is: ${selectionDisabled ? 'Off' : 'On'}`;


  const handleSelectionMenuDismiss = useCallback((choice) => () => {
    if (choice) {
      onSelectionMenuItemClick(choice);
    }
    setSelectMenuEl(null);
  }, [onSelectionMenuItemClick]);


  if (disableSelectionMenu) {
    return (
      <ToolbarItem
        control={(
          <IconButton
            className={classes.button}
            color={selectionDisabled ? 'default' : 'primary'}
            onClick={onToggle}
          >
            <GpsFixedIcon />
          </IconButton>
        )}
        tooltip={tooltip}
      />
    );
  }

  return (
    <>
      <ButtonGroup>
        <Tooltip title={tooltip}>
          <Button
            classes={{
              root: classes.buttonGroupButton,
              outlined: selectionDisabled ? classes.disabled : classes.enabled,
            }}
            onClick={onToggle}
            variant="outlined"
          >
            <GpsFixedIcon />
          </Button>
        </Tooltip>

        <Button
          className={classes.menuButton}
          disabled={selectionDisabled}
          onClick={(e) => setSelectMenuEl(e.currentTarget)}
          size="small"
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

      <Menu
        anchorEl={selectMenuEl}
        open={Boolean(selectMenuEl)}
        onClose={handleSelectionMenuDismiss(null)}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleSelectionMenuDismiss('all')}>
          Select All
        </MenuItem>
        <MenuItem onClick={handleSelectionMenuDismiss('none')}>
          Deselect All
        </MenuItem>
      </Menu>
    </>
  );
}

ListViewSelectionControl.propTypes = {
  disableSelectionMenu: PropTypes.bool,
  selectionDisabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onSelectionMenuItemClick: PropTypes.func.isRequired,
};

ListViewSelectionControl.defaultProps = {
  disableSelectionMenu: false,
};

export default ListViewSelectionControl;