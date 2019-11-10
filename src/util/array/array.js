import slice from 'lodash.slice';

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

export function removeObject(originalArray, fieldName, value) {
  const array = originalArray.slice();
  for (let i = array.length - 1; i >= 0; --i) {
    if (array[i][fieldName] === value) {
      array.splice(i, 1);
    }
  }
  return array;
}

export function chunk(array, size) {
  const length = (array === null) ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }

  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));

  while (index < length) {
    result[resIndex++] = slice(array, index, (index += size));
  }

  return result;
}
