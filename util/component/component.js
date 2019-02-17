'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
  if (errorMap === null) {
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