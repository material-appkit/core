import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlinedBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import ExpandableBox from './ExpandableBox';

import { arrayToObject } from '../util/array';

const variantPropType = PropTypes.oneOf(['single', 'multiple']).isRequired;

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
  const { choice, selected, variant, ...listItemProps } = props;

  let IconComponent = null;
  let iconClassName = null;
  if (selected) {
    IconComponent = variant === 'multiple' ? CheckBoxIcon : RadioButtonCheckedIcon;
    iconClassName = classes.listItemIconSelected;
  } else {
    IconComponent = variant === 'multiple' ? CheckBoxOutlinedBlankIcon : RadioButtonUncheckedIcon;
    iconClassName = null;
  }

  return (
    <ListItem
      button
      className={classes.listItem}
      {...listItemProps}
    >
      <ListItemIcon className={classes.listItemIcon}>
        <IconComponent className={iconClassName} fontSize="small" />
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
  variant: variantPropType,
};


// -----------------------------------------------------------------------------
function ChoiceList(props) {
  const { choices, value, variant } = props;
  const [fieldValueLabel, setFieldValueLabel] = useState('Any');
  const [selection, setSelection] = useState(new Set());

  useEffect(() => {
    let valueLabel = 'Any';
    let newSelection = new Set();

    if (value === null) {
      newSelection = null;
      valueLabel = props.nullLabel;
    } else if (value && value.length) {
      newSelection = new Set(value.split(',').filter(v => Boolean(v)));

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


  const handleNullListItemClick = () => {
    let updatedSelection = null;

    if (selection === null) {
      updatedSelection = new Set();
    } else {
      updatedSelection = null;
    }
    setSelection(updatedSelection);
    props.onSelectionChange(updatedSelection);
  };


  const handleValueListItemClick = (option) => () => {
    const optionValue = option.value;

    let updatedSelection = new Set(selection);

    if (updatedSelection.has(optionValue)) {
      updatedSelection.delete(optionValue);
    } else {
      if (variant === 'single') {
        updatedSelection = new Set([optionValue]);
      } else {
        updatedSelection.add(optionValue);

      }
    }

    props.onSelectionChange(updatedSelection);
  };

  return (
    <ExpandableBox
      defaultExpanded={Boolean(value === null || (value && value.length))}
      label={props.label}
      valueLabel={fieldValueLabel}
    >
      <List disablePadding>
        {props.nullLabel &&
          <ChoiceListItem
            choice={{ value: null, label: props.nullLabel }}
            onClick={handleNullListItemClick}
            selected={selection === null}
            variant={variant}
          />
        }
        {choices.map((choice) => (
          <ChoiceListItem
            choice={choice}
            key={choice.value}
            onClick={handleValueListItemClick(choice)}
            selected={selection && selection.has(choice.value)}
            variant={variant}
          />
        ))}
      </List>
    </ExpandableBox>
  );
}

ChoiceList.propTypes = {
  choices: PropTypes.array.isRequired,
  label: PropTypes.string,
  nullLabel: PropTypes.string,
  onSelectionChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  variant: variantPropType,
};

ChoiceList.defaultProps = {
  variant: 'multiple',
};

export default ChoiceList;
