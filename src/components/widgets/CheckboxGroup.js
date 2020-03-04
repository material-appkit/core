/**
*
* CheckboxGroupWidget
*
*/

import classNames from 'classnames';

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  defaultFieldset: theme.form.customControl.fieldset,
  legend: theme.form.customControl.legend,

  borderlessFieldset: {
    border: 'none',
    padding: 0,
  },
}));

function CheckboxGroupWidget(props) {
  const { fieldInfo, label } = props;

  const [selection, setSelection] = useState(new Set(props.value || []));
  const itemValueMapRef = useRef(null);
  const itemNameMapRef = useRef(null);

  /**
   * Helper function to determine if an item's selection should be implied
   * by the selection of a related item
   * @param item
   * @returns {boolean}
   */
  // const isSelectionImplied = (item) => {
  //   for (const itemName of Object.keys(props.implicitSelectionMap)) {
  //     const itemId = itemNameMapRef.current[itemName].id;
  //     if (selectedItemIds.has(itemId)) {
  //       for (const implicitItemLabel of props.implicitSelectionMap[itemName]) {
  //         const implicitItem = itemNameMapRef.current[implicitItemLabel];
  //         if (item.id === implicitItem.id) {
  //           return true;
  //         }
  //       }
  //     }
  //   }
  //
  //   return false;
  // };
  //
  const handleCheckboxClick = (choiceInfo) => {
    const newSelection = new Set(selection);
    if (newSelection.has(choiceInfo.value)) {
      newSelection.delete(choiceInfo.value);
    } else {
      newSelection.add(choiceInfo.value);
    }
    setSelection(newSelection);

    props.onChange(Array.from(newSelection));
  };


  let widgetInfo = {};
  if (fieldInfo.ui && typeof(fieldInfo.ui.widget) === 'object') {
    widgetInfo = fieldInfo.ui.widget;
  }

  const classes = styles();

  const fieldsetClasses = [];
  if (widgetInfo.border === false) {
    fieldsetClasses.push(classes.borderlessFieldset);
  } else {
    fieldsetClasses.push(classes.defaultFieldset);
  }

  return (
    <FormControl fullWidth margin="dense">
      <fieldset className={classNames(fieldsetClasses)}>
        {label &&
          <legend className={classes.legend}>
            {label}
          </legend>
        }

        <FormGroup {...(widgetInfo.formGroupProps || {})}>
          {fieldInfo.choices.map((choiceInfo) => {
            const formControlLabelStyle = {};
            if (widgetInfo.minLabelWidth) {
              formControlLabelStyle.minWidth = widgetInfo.minLabelWidth;
            }

            const formControlLabel = (
              <Typography style={formControlLabelStyle}>
                {choiceInfo.label}
              </Typography>
            );

            return (
              <FormControlLabel
                key={choiceInfo.value}
                control={(
                  <Checkbox
                    checked={selection.has(choiceInfo.value)}
                    onClick={() => {
                      handleCheckboxClick(choiceInfo);
                    }}
                    value={choiceInfo.value}
                  />
                )}
                label={choiceInfo.tooltip ? (
                  <Tooltip title={choiceInfo.tooltip}>
                    {formControlLabel}
                  </Tooltip>
                ) : (
                  formControlLabel
                )}
              />
            );
          })}
        </FormGroup>
      </fieldset>
    </FormControl>
  );
}

CheckboxGroupWidget.propTypes = {
  fieldInfo: PropTypes.object.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
};

export default CheckboxGroupWidget;
