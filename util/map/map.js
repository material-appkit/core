/**
 * @param map
 * @returns Return the first object in the map's value set.
 */
export function firstObject(map) {
  if (map.size === 0) {
    return null;
  }

  return map.values().next().value;
}


/**
 * Return the index of the given key in the map,
 * or -1 if no such key exists;
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
