import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cx from 'classnames';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';

export default class TabList extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object,
    ]),
  };

  render() {
    const { children, className, ...attributes } = this.props;

    return (
      <Breadcrumbs {...attributes} className={cx(className)} role="tablist">
        {children}
      </Breadcrumbs>
    );
  }
}

TabList.tabsRole = 'TabList';
