"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayToObject = arrayToObject;
exports.removeObject = removeObject;
/**
 * Helper function to convert an array of objects into a map using a key
 * that is common to all elements in the array.
 */
function arrayToObject(array, key) {
  return array.reduce(function (data, value) {
    data[value[key]] = value; // eslint-disable-line no-param-reassign
    return data;
  }, {});
}

function removeObject(array, fieldName, value) {
  for (var i = array.length - 1; i >= 0; --i) {
    if (array[i][fieldName] === value) {
      array.splice(i, 1);
    }
  }
}