/**
 * Helper function to convert an array of objects into a map using a key
 * that is common to all elements in the array.
 */

import { valueForKeyPath as objectValueForKeyPath } from '../object';

export function arrayToObject(array, key) {
  return array.reduce((data, value) => {
    data[value[key]] = value; // eslint-disable-line no-param-reassign
    return data;
  }, {});
}


/**
 * Given an array of objects, return an array of arrays of length {size}
 */
export function chunk(array, size) {
  const result = [];
  for (let i = 0, n = array.length; i < n; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}


/**
 * Given an array of objects, return the first one where
 * obj[fieldName] === value
 */
export function findObject(array, fieldName, value) {
  return array.find((item) => item[fieldName] === value);
}


export function makeChoices(choiceInfoList, valueKey, labelKey) {
  return choiceInfoList.map((choiceInfo) => ({
    [valueKey || 'value']: choiceInfo[0],
    [labelKey || 'label']: choiceInfo[1],
  }));
}


export function removeObject(array, fieldName, value) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i >= 0; --i) {
    if (newArray[i][fieldName] === value) {
      newArray.splice(i, 1);
    }
  }
  return newArray;
}


export function replaceObject(array, fieldName, value) {
  const imageIndex = array.findIndex(
    (obj) => obj[fieldName] === value[fieldName]
  );
  
  if (imageIndex !== -1) {
    array[imageIndex] = value;
  }
}


export function shuffle(array) {
  const arrayLength = array.length;
  for (let i = arrayLength - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export function valueForKeyPath(array, keyPath) {
  return array.map((value) => {
    return objectValueForKeyPath(value, keyPath);
  })
}
