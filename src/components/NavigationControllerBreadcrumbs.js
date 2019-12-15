import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';

function TabList(props) {
  const { children, ...attributes } = props;

  return (
    <Breadcrumbs {...attributes} role="tablist">
      {children}
    </Breadcrumbs>
  );
}

TabList.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]),
};

TabList.tabsRole = 'TabList';

export default TabList;