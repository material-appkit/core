/**
 * Return true if a given value is anything other than:
 * - undefined
 * - null
 * - An empty string
 * - NaN
 */
export function isValue(value) {
  return (
    value !== undefined &&
    value !== null &&
    value !== '' &&
    !Number.isNaN(value)
  );
}
