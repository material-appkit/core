/**
 * @param {Map} map
 *
 * @returns {*}
 * Return the first object in the map's value set.
 */
export function firstObject(map) {
  if (map.size === 0) {
    return null;
  }

  return map.values().next().value;
}


/**
 * @param {*} key
 * Key of map entry to locate index of
 *
 * @param {Map} map
 * Map to query for the given key
 *
 * @returns {Number}
 * The index of the given key in the map or -1 if no such key exists
 */
export function indexOfKey(key, map) {
  let index = 0;
  for (let k of map.keys()) {
    if (k === key) {
      return index;
    }
    index++;
  }
  return -1;
}
