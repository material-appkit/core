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
  const { avatarField, primaryField, secondaryField, ...rest } = props;

  const avatar = useMemo(() => {
    if (!avatarField) {
      return null;
    }

    let avatarContent = null;
    if (typeof(avatarField) === 'function') {
      avatarContent = avatarField(props.item);
    } else {
      avatarContent = (
        <Avatar src={valueForKeyPath(props.item, avatarField)} />
      );
    }

    return <ListItemAvatar>{avatarContent}</ListItemAvatar>;
  }, [avatarField]);

  const primary = useMemo(() => {
    if (!primaryField) {
      return null;
    }

    if (typeof(primaryField) === 'function') {
      return primaryField(props.item);
    } else {
      return (
        <Typography variant="body1" component="span" display="block">
          {valueForKeyPath(props.item, primaryField)}
        </Typography>
      );
    }
  }, [primaryField]);

  const secondary = useMemo(() => {
    if (!secondaryField) {
      return null;
    }

    if (typeof(secondaryField) === 'function') {
      return secondaryField(props.item);
    } else {
      return (
        <Typography variant="body2" color="textSecondary" display="block">
          {valueForKeyPath(props.item, secondaryField)}
        </Typography>
      );
    }
  }, [secondaryField]);


  return (
    <ListViewItem {...listItemProps(rest)}>
      {avatar}

      <ListItemText
        disableTypography
        primary={primary}
        secondary={secondary}
      />
    </ListViewItem>
  );
}
SimpleListItem.propTypes = {
  avatarField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  primaryField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  secondaryField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  ...commonPropTypes,
};


// -----------------------------------------------------------------------------
export default React.memo(SimpleListItem);
