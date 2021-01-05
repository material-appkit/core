/**
 *
 * @summary
 * Returns __false__ if the given value is `null` or `undefined`, otherwise __true__.
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
 * Returns __false__ if the given value is `null`, `undefined`, `NaN`, or `""`,
 * otherwise __true__.
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

