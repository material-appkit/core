"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "isSuperset", {
  enumerable: true,
  get: function get() {
    return _set.isSuperset;
  }
});

Object.defineProperty(exports, "union", {
  enumerable: true,
  get: function get() {
    return _set.union;
  }
});

Object.defineProperty(exports, "intersection", {
  enumerable: true,
  get: function get() {
    return _set.intersection;
  }
});

Object.defineProperty(exports, "symmetricDifference", {
  enumerable: true,
  get: function get() {
    return _set.symmetricDifference;
  }
});

Object.defineProperty(exports, "difference", {
  enumerable: true,
  get: function get() {
    return _set.difference;
  }
});

var _set = _interopRequireDefault(require("./set"));