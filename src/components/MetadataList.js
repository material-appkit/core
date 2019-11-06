import moment from 'moment';
import titleCase from 'title-case';

import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { valueForKeyPath } from '../util/object';

// -----------------------------------------------------------------------------
const metadataListItemStyles = makeStyles((theme) => theme.metadataList.listItem);

function MetadataListItem(props) {
  const { fieldInfo, representedObject } = props;
  const classes = metadataListItemStyles();

  function renderValue(value) {
    if (Array.isArray(value)) {
      return value.map((item) => (
        <ListItem key={item.id} classes={{ root: classes.nestedListItemRoot }}>
          {renderValue(item)}
        </ListItem>
      ));
    }

    let renderedValue = value;
    if (fieldInfo.transform) {
      renderedValue = fieldInfo.transform(value);
    } else if (fieldInfo.dateFormat) {
      renderedValue = moment(value).format(fieldInfo.dateFormat);
    } else if (fieldInfo.keyPath) {
      renderedValue = valueForKeyPath(value, fieldInfo.keyPath);
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

  let value = representedObject[fieldInfo.name];
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

  let PrimaryComponent = null;
  const primaryComponentProps = {};
  if (fieldInfo.type === 'link' && value.path) {
    PrimaryComponent = Link;
    primaryComponentProps.component = RouterLink;
    primaryComponentProps.to = value.path;
  } else if (Array.isArray(value)) {
    PrimaryComponent = List;
    primaryComponentProps.disablePadding = true;
  } else {
    PrimaryComponent = Box;
  }

  return (
    <ListItem classes={{ root: classes.listItemRoot }}>
      {labelComponent}

      <ListItemText
        classes={{ root: classes.listItemTextRoot }}
        disableTypography
        primary={(
          <PrimaryComponent {...primaryComponentProps}>
            {renderValue(value)}
          </PrimaryComponent>
        )}
      />
    </ListItem>
  );
}

MetadataListItem.propTypes = {
  fieldInfo: PropTypes.object.isRequired,
  nullValue: PropTypes.string,
  representedObject: PropTypes.object.isRequired,
};

// -----------------------------------------------------------------------------
const metadataStyles = makeStyles((theme) => theme.metadataList);

function MetadataList(props) {
  const classes = metadataStyles();

  return (
    <List className={classes.root}>
      {props.arrangement.map((fieldInfo) => {
        let key = fieldInfo.name;
        if (fieldInfo.keyPath) {
          key = `${key}-${fieldInfo.keyPath}`;
        }

        return (
          <MetadataListItem
            key={key}
            fieldInfo={fieldInfo}
            representedObject={props.representedObject}
          />
        );
      })}
    </List>
  );
}

MetadataList.propTypes = {
  arrangement: PropTypes.array.isRequired,
  representedObject: PropTypes.object.isRequired,
};

export default MetadataList;
