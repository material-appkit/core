import { valueForKeyPath as arrayValueForKeyPath } from '../array';
import { isValue } from '../value';

/**
 * Given an object, return a new object with only the keys
 * contained in the given `keys` array
 */
export function filterByKeys(object, keys) {
  const filteredObject = {};
  Object.keys(object).forEach((key) => {
    if (keys.indexOf(key) !== -1) {
      filteredObject[key] = object[key];
    }
  });
  return filteredObject;
}

/**
 * Return a copy of the given object _minus_ the given keys.
 * @param object Object to be filtered
 * @param keys An array containing keys to exclude
 * @returns {{}} A copy of the original object without the excluded keys
 */
export function filterExcludeKeys(object, keys) {
  const filteredObject = {};
  Object.keys(object).forEach((key) => {
    if (keys.indexOf(key) === -1) {
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
export function filterEmptyValues(obj) {
  const filteredObject = {};
  for (const key in obj) {
    if (isValue(obj[key])) {
      filteredObject[key] = obj[key];
    }
  }
  return filteredObject;
}

/**
 * Helper function to convert an object of key:value pairs into an array
 * of the form[{ key:value }, {key:value} ...]
 */
export function objectToArray(object) {
  return Object.keys(object).reduce((array, key) => {
    array.push({key, value: object[key]});
    return array;
  }, []);
}

/**
 * Retrieves a value at the given key path.
 * @param object
 * @param keyPath A dot (.) delimited series of keys
 * @returns {*} Value at the given key path
 */
export function valueForKeyPath(object, keyPath) {
  const keys = keyPath.split('.');
  let value = object;

  while (keys.length) {
    const key = keys.shift();

    // If the encountered property doesn't exist, bail out.
    if (value === null || value === undefined || value.hasOwnProperty(key) === false) {
      return null;
    }

    if (Array.isArray(value[key]) && keys.length) {
      // If at some point along the keypath an array is encountered,
      // let the array implementation of 'valueForKeyPath' be used
      // for the remainder of the keys
      return arrayValueForKeyPath(value[key], keys.join('.'));
    } else {
      value = value[key];
    }
  }

  return value;
}


/**
 * Set a value at the given key path.
 * @param obj
 * @param keyPath
 * @param value
 */
export function setValueForKeyPath(obj, keyPath, value) {
  let targetObj = obj;

  const pathComponents = keyPath.split('.');
  let currentPathElement = undefined;
  while((currentPathElement = pathComponents.shift()) !== undefined) {
    if (!targetObj[currentPathElement]) {
      targetObj[currentPathElement] = {};
    }

    if (pathComponents.length) {
      targetObj = targetObj[currentPathElement];
    } else {
      targetObj[currentPathElement] = value;
    }
  }
}


/**
 * This function recursively compares the properties of two objects.
 * If it finds a difference (including differences in nested objects or arrays),
 * it records the old and new values in the diff object,
 * using the property path as the key.
 */
export function deepDiff(obj1, obj2) {
  const diff = {};

  function compare(item1, item2, keyPath = '') {
    if (typeof item1 !== 'object' || item1 === null || typeof item2 !== 'object' || item2 === null) {
      if (item1 !== item2) {
        diff[keyPath] = { old: item1, new: item2 };
      }
      return;
    }

    const keys1 = Object.keys(item1);
    const keys2 = Object.keys(item2);
    const allKeys = new Set([...keys1, ...keys2]);

    for (const key of allKeys) {
      const newKeyPath = keyPath ? `${keyPath}.${key}` : key;
      compare(item1[key], item2[key], newKeyPath);
    }
  }

  compare(obj1, obj2);
  return diff;
}
