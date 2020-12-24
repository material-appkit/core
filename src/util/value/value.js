export function isSet(value) {
  return (value !== undefined && value !== null);
}

/**
 * Return true if a given value is anything other than:
 * - undefined
 * - null
 * - An empty string
 * - NaN
 */
export function isValue(value) {
  return (
    isSet(value) &&
    value !== '' &&
    !Number.isNaN(value)
  );
}

