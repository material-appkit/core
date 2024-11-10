import { isValue } from './value';

/**
 *
 * @param value
 * @param options
 * @returns {*}
 */
export function toCurrency(value, options) {
  if (!value) {
    return '---';
  }
  const numericValue = Number(value);
  const isInt = Number.isInteger(numericValue);

  const localeOptions = {
    style: 'currency',
    currency: 'USD',
    ...(options || {}),
  };

  if (!localeOptions.minimumFractionDigits) {
    localeOptions.minimumFractionDigits = isInt ? 0 : 2;
  }
  if (!localeOptions.maximumFractionDigits) {
    localeOptions.maximumFractionDigits = isInt ? 0 : 2;
  }

  let localizedValue = Math.abs(numericValue).toLocaleString('en-US', localeOptions);
  if (numericValue < 0) {
    localizedValue = `(${localizedValue})`
  }

  return localizedValue;
}

/**
 *
 * @param value
 * @returns {number}
 */
export function toInt(value) {
  if (!isValue(value)) {
    return null;
  }
  
  let intValue = value;

  if (typeof(intValue) === 'string') {
    intValue = intValue.replace(/[^0-9.]/g, "");
  }

  intValue = parseInt(intValue);
  return Number.isNaN(intValue) ? 0 : intValue;
}


/**
 *
 * @param value
 * @returns {number}
 */
export function toFloat(value) {
  if (!isValue(value)) {
    return null;
  }

  let floatValue = value;

  if (typeof(floatValue) === 'string') {
    floatValue = floatValue.replace(/[^0-9.-]/g, "");
  }

  floatValue = parseFloat(floatValue);
  return Number.isNaN(floatValue) ? 0 : floatValue;
}


export function toBoolean(value) {
  const falsyValues = new Set(['False', 'false', '0', '', 0, undefined, null]);
  return !falsyValues.has(value);
}
