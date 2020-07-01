import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckBoxOutlinedBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import { arrayToObject } from '../util/array';
import { useInit } from '../util/hooks';


const listItemStyles = makeStyles((theme) => ({
  listItem: {
    padding: 0,
  },

  listItemIcon: {
    marginRight: theme.spacing(1),
    minWidth: 'unset',
  },

  listItemIconSelected: {
    color: theme.palette.secondary.main,
  },

  listItemTextPrimary: {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.pxToRem(12),
  },
}));

function ChoiceListItem(props) {
  const classes = listItemStyles();
  const { choice, selected, ...listItemProps } = props;

  const IconComponent = selected ? CheckBoxIcon : CheckBoxOutlinedBlankIcon;
  const iconClassName = selected ? classes.listItemIconSelected : null;

  return (
    <ListItem
      button
      className={classes.listItem}
      {...listItemProps}
    >
      <ListItemIcon className={classes.listItemIcon}>
        <IconComponent
          className={iconClassName}
          fontSize="small"
        />
      </ListItemIcon>
      <ListItemText
        classes={{ primary: classes.listItemTextPrimary }}
        primary={choice.label}
      />
    </ListItem>
  );
}

ChoiceListItem.propTypes = {
  choice: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};


// -----------------------------------------------------------------------------

const styles = makeStyles((theme) => ({
  fieldLabel: {
    ...theme.mixins.filterFieldLabel,

    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  fieldValue: theme.mixins.filterFieldValue,

  disclosureButton: {
    justifyContent: 'flex-start',
    padding: 0,
  },

  disclosureButtonStartIcon: {
    margin: 0,
  },
}));

function ChoiceList(props) {
  const classes = styles();

  const { choices, value } = props;
  const [expanded, setExpanded] = useState(false);
  const [fieldValueLabel, setFieldValueLabel] = useState('Any');
  const [selection, setSelection] = useState(new Set());


  useInit(() => {
    if (value && value.length) {
      setExpanded(true);
    }
  });

  useEffect(() => {
    let valueLabel = 'Any';
    let newSelection = new Set();

    if (value) {
      if (value === 'null') {
        newSelection = new Set(null);
      } else {
        newSelection = new Set(value.split(',').filter(v => Boolean(v)));
      }

      const valueChoiceMap = arrayToObject(choices, 'value');
      const selectedChoiceLabels = [...newSelection].map((v) =>
        valueChoiceMap[v] ? valueChoiceMap[v].label : '???'
      );

      if (newSelection.size < 3) {
        valueLabel = selectedChoiceLabels.sort().join(', ');
      } else {
        valueLabel = `${newSelection.size} Selected`;
      }
    }
    setFieldValueLabel(valueLabel);
    setSelection(newSelection);

  }, [choices, value]);


  const toggleSelected = (option) => {
    const optionValue = option.value;
    const updatedSelection = new Set(selection);
    if (updatedSelection.has(optionValue)) {
      updatedSelection.delete(optionValue);
    } else {
      updatedSelection.add(optionValue);
    }

    props.onSelectionChange(updatedSelection);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" marginBottom={0.5}>
        <Button
          classes={{
            root: classes.disclosureButton,
            label: classes.fieldLabel,
            startIcon: classes.disclosureButtonStartIcon,
          }}
          disableRipple
          disableFocusRipple
          onClick={() => setExpanded(!expanded)}
          startIcon={expanded ? (
            <ExpandMoreIcon />
          ) : (
            <ChevronRightIcon />
          )}
        >
          {props.label}
        </Button>

        <Typography className={classes.fieldValue}>
          {fieldValueLabel}
        </Typography>
      </Box>

      {expanded &&
        <List disablePadding>
          {choices.map((choice) => (
            <ChoiceListItem
              choice={choice}
              key={choice.value}
              onClick={() => { toggleSelected(choice); }}
              selected={selection.has(choice.value)}
            />
          ))}
        </List>
      }
    </Box>
  );
}

ChoiceList.propTypes = {
  choices: PropTypes.array.isRequired,
  label: PropTypes.string,
  onSelectionChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  variant: PropTypes.oneOf(['single', 'multiple']),
};

ChoiceList.defaultProps = {
  variant: 'multiple',
};

export default ChoiceList;
