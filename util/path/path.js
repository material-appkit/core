"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.include = include;
exports.lastPathComponent = lastPathComponent;
var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

function include(base, routes) {
  var mappedRoutes = {
    toString: function toString() {
      return base;
    }
  };

  Object.keys(routes).forEach(function (route) {
    var url = routes[route];

    if (typeof url === "function" && route === "toString") {
      mappedRoutes.toString = function () {
        return base + routes.toString();
      };
    } else if ((typeof url === "undefined" ? "undefined" : _typeof(url)) === "object") {
      // nested include - prefix all sub-routes with base
      mappedRoutes[route] = include(base, url);
    } else {
      mappedRoutes[route] = [base, url].filter(function (component) {
        return component;
      }).join("/").replace("//", "/");
    }
  });

  return mappedRoutes;
}

function lastPathComponent(path) {
  var pathComponents = path.split('/');
  var pathComponentCount = pathComponents.length;
  if (!pathComponentCount) {
    return null;
  }

  return pathComponents[pathComponentCount - 1];
}