'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recursiveMap = recursiveMap;
exports.decorateErrors = decorateErrors;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function recursiveMap(children, transform) {
  return _react2.default.Children.map(children, function (child) {
    // If the given child is not a React component, simply return it
    if (!_react2.default.isValidElement(child)) {
      return child;
    }

    if (child.props.children) {
      child = _react2.default.cloneElement(child, {
        children: recursiveMap(child.props.children, transform)
      });
    }

    return transform(child);
  });
}

function decorateErrors(rootComponent, errorMap) {
  if (errorMap === null) {
    return rootComponent;
  }

  var applyErrorProps = function applyErrorProps(child) {
    // If this component doesn't have a name prop, it can't possibly be
    // decorated with an error message.
    if (child.props.name) {
      var errorMessages = errorMap[child.props.name];
      if (errorMessages) {
        var errorProps = {
          error: true,
          helperText: errorMessages
        };

        return _react2.default.cloneElement(child, errorProps);
      }
    }

    return child;
  };

  return recursiveMap(rootComponent, applyErrorProps);
}