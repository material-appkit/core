export function isSuperset(set, subset) {
  for (const elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

export function union(setA, setB) {
  const _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

export function intersection(setA, setB) {
  const _intersection = new Set();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

export function symmetricDifference(setA, setB) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    if (_difference.has(elem)) {
      _difference.delete(elem);
    } else {
      _difference.add(elem);
    }
  }
  return _difference;
}

export function difference(setA, setB) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}


export function find(set, resolverFunc) {
  for (const item of set) {
    if (resolverFunc(item)) {
      return item;
    }
  }
  return null;
}

export function pluck(set) {
  if (set.size) {
    return set.values().next().value;
  }
  return null;
}

export function replaceObject(set, fieldName, value) {
  for (const obj of set) {
    if (obj[fieldName] === value[fieldName]) {
      set.delete(obj);
      set.add(value);
      return;
    }
  }
}

export function removeObject(set, fieldName, value) {
  for (const obj of set) {
    if (obj[fieldName] === value[fieldName]) {
      set.delete(obj);
      return;
    }
  }
}


