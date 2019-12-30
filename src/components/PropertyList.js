import titleCase from 'title-case';

import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { valueForKeyPath } from '../util/object';

//----------------------------------------------------------------------------
// Helper function that renders a given value or list of values
function renderValue(value, fieldInfo) {
  if (Array.isArray(value)) {
    return value.map((item, i) => (
      <Fragment key={i}>
        {renderValue(item, fieldInfo)}
      </Fragment>
    ));
  }

  let renderedValue = value;
  if (fieldInfo.transform) {
    renderedValue = fieldInfo.transform(value);
  }

  if (typeof(renderedValue) === 'string') {
    renderedValue = (
      <Typography variant="body2">
        {renderedValue}
      </Typography>
    );
  }

  return renderedValue;
}

// -----------------------------------------------------------------------------
const metadataListItemStyles = makeStyles(
  (theme) => theme.metadataList.listItem
);

function PropertyListItem(props) {
  const {
    fieldInfo,
    LinkComponent,
    representedObject
  } = props;
  const classes = metadataListItemStyles();

  //----------------------------------------------------------------------------
  let value = null;
  if (fieldInfo.keyPath) {
    value = valueForKeyPath(representedObject, fieldInfo.keyPath);
  } else {
    value = representedObject[fieldInfo.name];
  }

  if (value === undefined || value === null || (Array.isArray(value) && !value.length)) {
    if (!fieldInfo.nullValue) {
      // If no value exists for the given field and nothing has been specified
      // to display for null values, returning null skips rendering of the list item.
      return null;
    } else {
      value = fieldInfo.nullValue;
    }
  }

  let LabelContent = fieldInfo.label;
  if (LabelContent === undefined) {
    LabelContent = titleCase(fieldInfo.name);
  }

  let labelComponent = null;
  if (LabelContent) {
    if (typeof(LabelContent) === 'string') {
      labelComponent = (
        <Typography variant="body2" className={classes.label}>
          {LabelContent}
        </Typography>
      );
    } else {
      labelComponent = (
        <ListItemIcon classes={{ root: classes.listItemIconRoot }}>
          <LabelContent className={classes.listItemIcon} />
        </ListItemIcon>
      );
    }
  }

  let PrimaryComponent = Box;
  const primaryComponentProps = {};
  if (fieldInfo.type === 'link' && value.path && LinkComponent) {
    PrimaryComponent = Link;
    primaryComponentProps.component = LinkComponent;
    primaryComponentProps.to = value.path;
  } else if (Array.isArray(value)) {
    primaryComponentProps.className = classes.nestedList;
  }

  return (
    <ListItem classes={{ root: classes.listItemRoot }}>
      {labelComponent}

      <ListItemText
        classes={{ root: classes.listItemTextRoot }}
        disableTypography
        primary={(
          <PrimaryComponent {...primaryComponentProps}>
            {renderValue(value, fieldInfo)}
          </PrimaryComponent>
        )}
      />
    </ListItem>
  );
}

PropertyListItem.propTypes = {
  fieldInfo: PropTypes.object.isRequired,
  nullValue: PropTypes.string,
  LinkComponent: PropTypes.func,
  representedObject: PropTypes.object.isRequired,
};

// -----------------------------------------------------------------------------
const metadataStyles = makeStyles((theme) => theme.metadataList);

function PropertyList(props) {
  const classes = metadataStyles();

  const {
    arrangement,
    LinkComponent,
    representedObject
  } = props;

  return (
    <List className={classes.root}>
      {arrangement.map((fieldInfo) => {
        let key = fieldInfo.name;
        if (fieldInfo.keyPath) {
          key = `${key}-${fieldInfo.keyPath}`;
        }

        return (
          <PropertyListItem
            key={key}
            fieldInfo={fieldInfo}
            LinkComponent={LinkComponent}
            representedObject={representedObject}
          />
        );
      })}
    </List>
  );
}

PropertyList.propTypes = {
  arrangement: PropTypes.array.isRequired,
  LinkComponent: PropTypes.func,
  representedObject: PropTypes.object.isRequired,
};

export default PropertyList;
