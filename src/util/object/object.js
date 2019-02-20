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
 * Return a new object containing only those key/value pairs
 * that have a non-falsy value.
 * @param object
 */
export function filterEmptyValues(object) {
  const filteredObject = {};
  for (const key in object) {
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
export function objectToArray(object) {
  return Object.keys(object).reduce((array, key) => {
    array.push({key, value: object[key]});
    return array;
  }, []);
}

export function valueForKeyPath(object, keyPath) {
  const keys = keyPath.split('.');
  let value = object;

  for (let i = 0, n = keys.length; i < n; ++i) {
    const key = keys[i];

    // If the encoutnered property doesn't exist, bail out.
    if (value === null || value.hasOwnProperty(key) === false) {
      return null;
    }

    value = value[key];
  }

  return value;
}
