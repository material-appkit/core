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

export function removeObject(array, fieldName, value) {
  for (let i = array.length - 1; i >= 0; --i) {
    if (array[i][fieldName] === value) {
      array.splice(i, 1);
    }
  }
}
