"use strict";

const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "now", {
  enumerable: true,
  get: function get() {
    return _date.now;
  },
});

Object.defineProperty(exports, "timestamp", {
  enumerable: true,
  get: function get() {
    return _date.timestamp;
  },
});

const _date = _interopRequireDefault(require("./date"));
