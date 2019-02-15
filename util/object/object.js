'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterByKeys = filterByKeys;
exports.filterEmptyValues = filterEmptyValues;
exports.objectToArray = objectToArray;
exports.valueForKeyPath = valueForKeyPath;
/**
 * Given an object, return a new object with only the keys
 * contained in the given `keys` array
 */
function filterByKeys(object, keys) {
  var filteredObject = {};
  Object.keys(object).forEach(function (key) {
    if (keys.indexOf(key) !== -1) {
      filteredObject[key] = object[key];
    }
  });
  return filteredObject;
}

/**
 * Return a new object containing only those key/value pairs
 * that have a non-falsy value.
 * @param object
 */
function filterEmptyValues(object) {
  var filteredObject = {};
  for (var key in object) {
    if (object[key] !== null && object[key] !== undefined) {
      filteredObject[key] = object[key];
    }
  }
  return filteredObject;
}

/**
 * Helper function to convert an object of key:value pairs into an array
 * of the form[{ key:value }, {key:value} ...]
 */
function objectToArray(object) {
  return Object.keys(object).reduce(function (array, key) {
    array.push({ key: key, value: object[key] });
    return array;
  }, []);
}

function valueForKeyPath(object, keyPath) {
  var keys = keyPath.split('.');
  var value = object;

  keys.forEach(function (key) {
    // If the encoutnered property doesn't exist, bail out.
    if (value === null || value.hasOwnProperty(key) === false) {
      return null;
    }

    value = value[key];
  });

  return value;
}