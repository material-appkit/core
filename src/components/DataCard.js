/**
*
* DataCard
*
*/

import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';

import { recursiveMap } from '../util/component';

import Form from './Form';

const styles = makeStyles(
  (theme) => theme.dataCard
);

function DataCard(props) {
  const [mode, setMode] = useState('view');
  const classes = styles();

  const formRef = useRef(null);


  const toggleMode = async() => {
    const newMode = mode === 'view' ? 'edit' : 'view';

    let shouldToggleView = true;

    if (mode === 'edit' && newMode === 'view') {
      // When toggling from edit to view mode, in the event that this
      // card is managing a form for its edit view, instruct the the form
      // to save before toggling back.
      if (formRef.current) {
        const record = await formRef.current.save();
        if (!record) {
          shouldToggleView = false;
        }
      }
    }

    if (shouldToggleView) {
      setMode(newMode);
    }
  };

  const getActiveView = () => {
    const children = React.Children.toArray(props.children);
    const childCount = children.length;
    if (childCount < 1 || 2 < childCount) {
      throw new Error("A DataCard may only have ONE or TWO children");
    }

    if (childCount === 2) {
      return (mode === 'view') ? children[0] : children[1];
    }

    if (mode === 'edit' && props.formConfig) {
      return (
        <Form innerRef={formRef} {...props.formConfig} />
      );
    }
    // If there is a single child, allow it to manage its own presentation
    // via a given 'mode' prop.
    return recursiveMap(children[0], (child) => {
        return React.cloneElement(child, { mode });
    }, 2);
  };


  const { variant } = props;

  const cardProps = {};

  const cardHeaderClasses = {
    root: classes.cardHeaderRoot,
    action: classes.cardHeaderAction,
    title: classes.cardHeaderTitle,
  };

  const cardActionClasses = {
    root: classes.cardActionsRoot,
  };

  if (variant === 'plain') {
    cardProps.elevation = 0;
    cardHeaderClasses.root = classes.plainCardHeaderRoot;
  } else {
    cardProps.variant = variant;
  }

  return (
    <Card {...cardProps}>
      <CardHeader
        action={(
          <IconButton
            classes={{ root: classes.modeToggleButton }}
            color="primary"
            onClick={toggleMode}
          >
            {mode === 'view' ? (
              <EditIcon fontSize="small" />
            ): (
              <CheckIcon fontSize="small" />
            )}
          </IconButton>
        )}
        classes={cardHeaderClasses}
        title={props.title}
        subheader={props.subheader}
      />
      <CardContent classes={{ root: classes.cardContentRoot }}>
        <Box {...props.contentBoxProps}>
          {getActiveView()}
        </Box>
      </CardContent>

      {props.actions &&
        <CardActions classes={cardActionClasses}>
          {props.actions}
        </CardActions>
      }
    </Card>
  );
}

DataCard.propTypes = {
  actions: PropTypes.element,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  contentBoxProps: PropTypes.object,
  formConfig: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  variant: PropTypes.oneOf(['elevation', 'outlined', 'plain'])
};

DataCard.defaultProps = {
  contentBoxProps: { px: 2 },
  variant: 'elevation',
};

export default DataCard;
