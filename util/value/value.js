'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValue = isValue;
/**
 * Return true if a given value is anything other than:
 * - undefined
 * - null
 * - An empty string
 * - NaN
 */
function isValue(value) {
  return value !== undefined && value !== null && value !== '' && !Number.isNaN(value);
}