"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.firstObject = firstObject;
exports.indexOfKey = indexOfKey;
/**
 * @param map
 * @returns Return the first object in the map's value set.
 */
function firstObject(map) {
  if (map.size === 0) {
    return null;
  }

  return map.values().next().value;
}

/**
 * Return the index of the given key in the map,
 * or -1 if no such key exists;
 */
function indexOfKey(key, map) {
  var index = 0;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = map.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var k = _step.value;

      if (k === key) {
        return index;
      }
      index++;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return -1;
}