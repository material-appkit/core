import moment from 'moment';
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

// -----------------------------------------------------------------------------
const metadataListItemStyles = makeStyles((theme) => theme.metadataList.listItem);

function MetadataListItem(props) {
  const {
    fieldInfo,
    LinkComponent,
    representedObject
  } = props;
  const classes = metadataListItemStyles();

  function renderValue(value) {
    let renderedValue = value;
    if (fieldInfo.keyPath) {
      renderedValue = valueForKeyPath(renderedValue, fieldInfo.keyPath);
    }

    if (Array.isArray(renderedValue)) {
      return renderedValue.map((item, i) => (
        <Fragment key={i}>
          {renderValue(item)}
        </Fragment>
      ));
    }

    if (fieldInfo.transform) {
      renderedValue = fieldInfo.transform(value);
    } else if (fieldInfo.dateFormat) {
      renderedValue = moment(value).format(fieldInfo.dateFormat);
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
  if (fieldInfo.type === 'link' && value.path && LinkComponent) {
    PrimaryComponent = Link;
    primaryComponentProps.component = LinkComponent;
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
  LinkComponent: PropTypes.func,
  representedObject: PropTypes.object.isRequired,
};

// -----------------------------------------------------------------------------
const metadataStyles = makeStyles((theme) => theme.metadataList);

function MetadataList(props) {
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
          <MetadataListItem
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

MetadataList.propTypes = {
  arrangement: PropTypes.array.isRequired,
  LinkComponent: PropTypes.func,
  representedObject: PropTypes.object.isRequired,
};

export default MetadataList;
