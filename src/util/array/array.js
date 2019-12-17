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

export function makeChoices(choiceInfoList, valueKey, labelKey) {
  return choiceInfoList.map((choiceInfo) => ({
    [valueKey || 'value']: choiceInfo[0],
    [labelKey || 'label']: choiceInfo[1],
  }));
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
