'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.recursiveMap = recursiveMap;
exports.decorateErrors = decorateErrors;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function recursiveMap(children, transform, maxDepth, depth) {
  return _react2.default.Children.map(children, function (child) {
    // If the given child is not a React component, simply return it
    if (!_react2.default.isValidElement(child) || maxDepth && depth >= maxDepth) {
      return child;
    }

    if (child.props.children) {
      child = _react2.default.cloneElement(child, {
        children: recursiveMap(child.props.children, transform, maxDepth, (depth || 0) + 1)
      });
    }

    return transform(child);
  });
}

function decorateErrors(rootComponent, errorMap) {
  if ((typeof errorMap === 'undefined' ? 'undefined' : _typeof(errorMap)) !== 'object') {
    throw new Error('Expected param "errorMap" to be an object');
  }

  if (!Object.keys(errorMap).length) {
    return rootComponent;
  }

  return recursiveMap(rootComponent, function (child) {
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
  }, null);
}