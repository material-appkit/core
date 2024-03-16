import PropTypes from 'prop-types';

import React, { useMemo } from 'react';

import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import { valueForKeyPath } from '../util/object';

import ListViewItem, {
  listItemProps,
  commonPropTypes,
} from './ListViewItem';


function SimpleListItem(props) {
  const {
    disableTypography,
    avatarField,
    avatarProps,
    primaryField,
    secondaryField,
    ...rest
  } = props;

  const avatar = useMemo(() => {
    if (!avatarField) {
      return null;
    }

    let avatarContent;
    if (typeof(avatarField) === 'function') {
      avatarContent = avatarField(props.item);
    } else {
      avatarContent = (
        <Avatar {...avatarProps}
          src={valueForKeyPath(props.item, avatarField)}
        />
      );
    }

    return <ListItemAvatar>{avatarContent}</ListItemAvatar>;
  }, [avatarField, avatarProps]);


  const primary = useMemo(() => {
    if (!primaryField) {
      return null;
    }

    if (typeof(primaryField) === 'function') {
      return primaryField(props.item);
    }

    const fieldValue = valueForKeyPath(props.item, primaryField);

    if (disableTypography) {
      return (
        <Typography variant="body1" component="span" display="block">
          {fieldValue}
        </Typography>
      );
    }

    return fieldValue;

  }, [disableTypography, primaryField]);

  const secondary = useMemo(() => {
    if (!secondaryField) {
      return null;
    }

    if (typeof(secondaryField) === 'function') {
      return secondaryField(props.item);
    }

    const fieldValue = valueForKeyPath(props.item, secondaryField);
    if (disableTypography) {
      return (
        <Typography variant="body2" color="textSecondary" display="block">
          {fieldValue}
        </Typography>
      );
    }

    return fieldValue;
  }, [disableTypography, secondaryField]);

  return (
    <ListViewItem {...listItemProps(rest)}>
      {avatar}

      <ListItemText
        disableTypography={disableTypography}
        primary={primary}
        secondary={secondary}
      />
    </ListViewItem>
  );
}
SimpleListItem.propTypes = {
  ...commonPropTypes,

  avatarProps: PropTypes.object,
  avatarField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  disableTypography: PropTypes.bool,
  primaryField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  secondaryField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

SimpleListItem.defaultProps = {
  avatarProps: {
    variant: 'rounded',
  }
}

// -----------------------------------------------------------------------------
export default SimpleListItem;
