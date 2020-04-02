/**
*
* CheckboxGroupWidget
*
*/

import classNames from 'classnames';

import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import EditDialog from '../EditDialog';
import ServiceAgent from '../../util/ServiceAgent';
import { arrayToObject } from '../../util/array';
import { useInit } from '../../util/hooks';


const styles = makeStyles((theme) => ({
  defaultFieldset: theme.form.customControl.fieldset,
  legend: theme.form.customControl.legend,

  borderlessFieldset: {
    border: 'none',
    padding: 0,
  },

  formGroup: {
    padding: `0 ${theme.spacing(0.5)}px`,
  },

  checkbox: {
    padding: theme.spacing(0.5),
  },

  linearProgress: {
    flex: 1,
  }
}));

function createChoice(item, field_map) {
  const choice = {...item};
  if (!field_map) {
    return choice;
  }

  Object.keys(field_map).forEach((key) => {
    choice[field_map[key]] = item[key];
  });
  return choice;


}
function CheckboxGroupWidget(props) {
  const { fieldInfo, label } = props;

  const [choices, setChoices] = useState(fieldInfo.choices || null);
  const [addDialogIsOpen, setAddDialogIsOpen] = useState(false);

  const choiceLabelMap = choices ? arrayToObject(choices, 'label') : {};
  const choiceValueMap = choices ? arrayToObject(choices, 'value') : {};

  let widgetInfo = {};
  if (fieldInfo.ui && typeof(fieldInfo.ui.widget) === 'object') {
    widgetInfo = fieldInfo.ui.widget;
  }
  const exclusionMap = widgetInfo.exclusionMap || {};
  const implicitSelectionMap = widgetInfo.implicitSelectionMap || {};

  const selection = new Set(props.value || []);

  let apiListUrl = widgetInfo.list_endpoint;
  if (!apiListUrl && fieldInfo.related_endpoint) {
    apiListUrl = `${fieldInfo.related_endpoint.singular}/`;
  }

  useInit(async() => {
    if (fieldInfo.choices) {
      setChoices(fieldInfo.choices);
    } else if (apiListUrl) {
      const filterParams = widgetInfo.filter_params || {};
      const res = await ServiceAgent.get(apiListUrl, filterParams);
      setChoices(res.body.map(
        (item) => createChoice(item, widgetInfo.choice_map)
      ));
    } else {
      throw new Error('"choices" or "related_endpoint" must be present in fieldInfo');
    }
  });

  //----------------------------------------------------------------------------
  /**
   * Helper function to determine if an item's selection should be implied
   * by the selection of a related item
   * @param choice
   * @returns {boolean}
   */
  const isSelectionImplied = (choice) => {
    for (const itemLabel of Object.keys(implicitSelectionMap)) {
      const itemValue = choiceLabelMap[itemLabel].value;
      if (selection.has(itemValue)) {
        for (const implicitItemLabel of implicitSelectionMap[itemLabel]) {
          const implicitChoice = choiceLabelMap[implicitItemLabel];
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
          const selectedChoice = choiceValueMap[value];
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
          const choice = choiceLabelMap[label];
          newSelection.add(choice.value);
        });
      }
    } else {
      newSelection.delete(choice.value);
    }

    props.onChange(Array.from(newSelection));
  };

  //----------------------------------------------------------------------------
  const handleEditDialogClose = () => {
    setAddDialogIsOpen(false);
  };

  const handleEditDialogSave = (record) => {
    const newChoice = createChoice(record, widgetInfo.choice_map);
    setChoices([...choices, newChoice]);

    handleEditDialogClose();
  };
  
  //----------------------------------------------------------------------------
  const classes = styles();

  const fieldsetClasses = [];
  if (widgetInfo.border === false) {
    fieldsetClasses.push(classes.borderlessFieldset);
  } else {
    fieldsetClasses.push(classes.defaultFieldset);
  }

  const formGroupProps = {...(widgetInfo.formGroupProps || {})};
  formGroupProps.className = classes.formGroup;

  return (
    <FormControl fullWidth margin="dense">
      <fieldset className={classNames(fieldsetClasses)}>
        {label &&
          <legend className={classes.legend}>
            {label}
          </legend>
        }

        {choices ? (
          <Fragment>
            <FormGroup {...formGroupProps}>
              {choices.map((choice) => {
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
                        className={classes.checkbox}
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

            {(apiListUrl && widgetInfo.create_endpoint) &&
              <Fragment>
                <Button
                  color="primary"
                  onClick={() => { setAddDialogIsOpen(true); }}
                  size="small"
                  startIcon={<AddIcon />}
                >
                  Add {widgetInfo.entity_type}...
                </Button>

                {addDialogIsOpen &&
                  <EditDialog
                    apiCreateUrl={widgetInfo.create_endpoint}
                    defaultValues={widgetInfo.filter_params}
                    entityType={widgetInfo.entity_type}
                    onClose={handleEditDialogClose}
                    onSave={handleEditDialogSave}
                  />
                }
              </Fragment>
            }
          </Fragment>
        ) : (
          <Box display="flex" alignItems="center" height={30}>
            <LinearProgress className={classes.linearProgress} />
          </Box>
        )}
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
