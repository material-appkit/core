'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styles = require('@material-ui/core/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FormActions(props) {
  var classes = props.classes;

  return _react2.default.createElement(
    'div',
    { className: classes.root },
    props.children
  );
} /**
  *
  * FormActions
  *
  */

FormActions.propTypes = {
  classes: _propTypes2.default.object.isRequired,
  children: _propTypes2.default.any
};

exports.default = (0, _styles.withStyles)({
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: '0 0 auto',
    justifyContent: 'flex-end',
    margin: 0
  }
})(FormActions);