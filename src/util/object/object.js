import { isValue } from '../value';
import { valueForKeyPath as arrayValueForKeyPath } from '../array';
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

export function valueForKeyPath(object, keyPath) {
  const keys = keyPath.split('.');
  let value = object;

  while (keys.length) {
    const key = keys.shift();

    // If the encoutnered property doesn't exist, bail out.
    if (value === null || value.hasOwnProperty(key) === false) {
      return null;
    }

    if (Array.isArray(value[key])) {
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
