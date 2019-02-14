'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.reverse = reverse;
exports.matchesForPath = matchesForPath;

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reverse(path, params) {
  var toPath = _pathToRegexp2.default.compile(path);
  return toPath(params);
}

function matchesForPath(pathname, routes) {
  var matches = [];
  routes.forEach(function (routeInfo) {
    var currentMatch = (0, _reactRouterDom.matchPath)(pathname, { path: routeInfo.path });
    if (currentMatch) {
      matches.push(_extends({}, currentMatch, routeInfo));
    }
  });
  return matches;
}