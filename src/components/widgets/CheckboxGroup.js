/**
*
* CheckboxGroupWidget
*
*/

import classNames from 'classnames';

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { arrayToObject } from '../../util/array';

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

  const selection = new Set(props.value || []);

  const choiceValueMapRef = useRef(arrayToObject(fieldInfo.choices, 'value'));
  const choiceLabelMapRef = useRef(arrayToObject(fieldInfo.choices, 'label'));

  let widgetInfo = {};
  if (fieldInfo.ui && typeof(fieldInfo.ui.widget) === 'object') {
    widgetInfo = fieldInfo.ui.widget;
  }
  const exclusionMap = widgetInfo.exclusionMap || {};
  const implicitSelectionMap = widgetInfo.implicitSelectionMap || {};

  //----------------------------------------------------------------------------
  /**
   * Helper function to determine if an item's selection should be implied
   * by the selection of a related item
   * @param choice
   * @returns {boolean}
   */
  const isSelectionImplied = (choice) => {
    for (const itemLabel of Object.keys(implicitSelectionMap)) {
      const itemValue = choiceLabelMapRef.current[itemLabel].value;
      if (selection.has(itemValue)) {
        for (const implicitItemLabel of implicitSelectionMap[itemLabel]) {
          const implicitChoice = choiceLabelMapRef.current[implicitItemLabel];
          if (choice.value === implicitChoice.value) {
            return true;
          }
        }
      }
    }

    return false;
  };

  const handleCheckboxChange = (choice) => (event) => {
    const newSelection = new Set(selection);
    if (event.target.checked) {
      newSelection.add(choice.value);

      const selectedChoiceLabel = choice.label;

      // Deselect tags that can not be combined with the selected tag
      const choiceLabelsToExclude = exclusionMap[selectedChoiceLabel];
      if (choiceLabelsToExclude) {
        Array.from(newSelection).forEach((value) => {
          const selectedChoice = choiceValueMapRef.current[value];
          if (choiceLabelsToExclude.indexOf(selectedChoice.label) !== -1) {
            newSelection.delete(value);
          }
        });
      }

      // Auto-select tags that are implied by the selected tag
      // Deselect tags that can not be combined with the selected tag
      const choiceLabelsToInclude = implicitSelectionMap[selectedChoiceLabel];
      if (choiceLabelsToInclude) {
        choiceLabelsToInclude.forEach((label) => {
          const choice = choiceLabelMapRef.current[label];
          newSelection.add(choice.value);
        });
      }
    } else {
      newSelection.delete(choice.value);
    }

    props.onChange(Array.from(newSelection));
  };

  //----------------------------------------------------------------------------
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
          {fieldInfo.choices.map((choice) => {
            const formControlLabelStyle = {};
            if (widgetInfo.minLabelWidth) {
              formControlLabelStyle.minWidth = widgetInfo.minLabelWidth;
            }

            let formControlLabel = (
              <Typography style={formControlLabelStyle}>
                {choice.label}
              </Typography>
            );
            if (choice.tooltip) {
              formControlLabel = (
                <Tooltip title={choice.tooltip}>
                  {formControlLabel}
                </Tooltip>
              );
            }

            return (
              <FormControlLabel
                key={choice.value}
                control={(
                  <Checkbox
                    disabled={isSelectionImplied(choice)}
                    checked={selection.has(choice.value)}
                    onChange={handleCheckboxChange(choice)}
                    value={choice.value}
                  />
                )}
                label={formControlLabel}
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
