/**
 *
 * @summary
 * Returns __true__ if a given value is anything other than null or
 * undefined, otherwise __false__.
 *
 * @param {*} value
 * Value to be evaluated as non-(null/undefined)
 *
 * @returns {boolean}
 */
export function isSet(value) {
  return (value !== undefined && value !== null);
}

/**
 * @summary
 * Returns __true__ if a given value is anything other than
 * (undefined, null, empty string, NaN), otherwise __false__.
 *
 * @param {*} value
 * Value to be evaluated as truthy or not
 *
 * @returns {boolean}
 */
export function isValue(value) {
  return (
    isSet(value) &&
    value !== '' &&
    !Number.isNaN(value)
  );
}

