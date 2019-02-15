'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SidebarSection = exports.SidebarHeading = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Drawer = require('@material-ui/core/Drawer');

var _Drawer2 = _interopRequireDefault(_Drawer);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _withWidth = require('@material-ui/core/withWidth');

var _withWidth2 = _interopRequireDefault(_withWidth);

var _styles = require('@material-ui/core/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//------------------------------------------------------------------------------
function SideBar(props) {
  var classes = props.classes,
      width = props.width;


  if (width === 'xs' || width === 'sm') {
    return _react2.default.createElement(
      'div',
      { className: classes.smallContainer },
      props.children
    );
  }

  return _react2.default.createElement(
    _Drawer2.default,
    {
      variant: 'permanent',
      classes: { paper: classes.drawerPaper },
      anchor: 'right'
    },
    props.children
  );
}

SideBar.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  children: _propTypes2.default.any,
  width: _propTypes2.default.string.isRequired
};

exports.default = (0, _styles.withStyles)(function (theme) {
  return {
    drawerPaper: {
      backgroundColor: '#fafafa',
      width: theme.sidebar.width,
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      paddingTop: theme.topBar.height + theme.navigationController.navBar.height + 20
    },

    smallContainer: {
      backgroundColor: '#fafafa',
      borderBottom: '1px solid #cacaca',
      padding: 20
    }
  };
})((0, _withWidth2.default)()(SideBar));

//------------------------------------------------------------------------------

function _SidebarSection(props) {
  return _react2.default.createElement(
    'section',
    { className: props.classes.section },
    props.children
  );
}

_SidebarSection.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  children: _propTypes2.default.any
};

var SidebarSection = (0, _styles.withStyles)({
  section: {
    '&:not(:last-child)': {
      marginBottom: 30
    }
  }
})(_SidebarSection);

// -----------------------------------------------------------------------------
function _SidebarHeading(props) {
  return _react2.default.createElement(
    _Typography2.default,
    {
      variant: 'h3',
      classes: { h3: props.classes.h3 }
    },
    props.text
  );
}

_SidebarHeading.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  text: _propTypes2.default.string.isRequired
};

var SidebarHeading = (0, _styles.withStyles)({
  h3: {
    fontSize: '1.15rem',
    marginBottom: 5
  }
})(_SidebarHeading);

// -----------------------------------------------------------------------------
exports.SidebarHeading = SidebarHeading;
exports.SidebarSection = SidebarSection;