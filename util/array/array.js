/**
 * Helper function to convert an array of objects into a map using a key
 * that is common to all elements in the array.
 */
export function arrayToObject(array, key) {
  return array.reduce((data, value) => {
    data[value[key]] = value; // eslint-disable-line no-param-reassign
    return data;
  }, {});
}
