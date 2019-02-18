'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SidebarSection = exports.SidebarHeading = undefined;

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _styles = require('@material-ui/core/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      marginBottom: 16
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
    fontSize: '1.1rem',
    fontWeight: 500,
    marginBottom: 5
  }
})(_SidebarHeading);

// -----------------------------------------------------------------------------
exports.SidebarHeading = SidebarHeading;
exports.SidebarSection = SidebarSection;