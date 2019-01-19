/**
 * Given an object, return a new object with only the keys
 * contained in the given `keys` array
 */
export function filterObjectByKeys(object, keys) {
  const filteredObject = {};
  Object.keys(object).forEach((key) => {
    if (keys.indexOf(key) !== -1) {
      filteredObject[key] = object[key];
    }
  });
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

  keys.forEach((key) => {
    // If the encoutnered property doesn't exist, bail out.
    if (value === null || value.hasOwnProperty(key) === false) {
      throw new Error(`Invalid key path: ${keyPath}`);
    }

    value = value[key];
  });

  return value;
}
