/**
 * @param str String to be encoded
 * @returns {string} Given string with '&', '<', '>', and '"'
 * substituted with HTML entity equivalents.
 */
export function encodeHTMLEntities(str) {
  return String(str)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}


/**
 *
 * @attribution
 * https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
 *
 * @param {String} str
 * String to be converted into a slug
 *
 * @returns {String}
 * Slugified version `string`
 */
export function slugify(str) {
  const a = 'àáäâãåèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
  const b = 'aaaaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return str.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

/**
 *
 * @param {String} str
 * String to remove suffix `value` from
 *
 * @param {String} value
 * Suffix to be removed from `string`
 *
 * @returns {String}
 * The given `string` without suffix `value`
 */
export function rstrip(str, value) {
  const lastIndex = str.lastIndexOf(value);
  if (lastIndex === -1) {
    return str;
  }

  return str.substring(0, lastIndex);
}

/**
 *
 * @param {String} str
 * String to be converted into title case
 *
 * @returns {String} The given `string`, converted into title case
 */
export function titleCase(str) {
  if (typeof(str) !== 'string') {
    return null;
  }

  const components = str.toLowerCase().replace(/ /g, '_').split('_');

  for (let i = 0, n = components.length; i < n; i++) {
    components[i] = components[i].charAt(0).toUpperCase() + components[i].slice(1);
  }
  return components.join(' ');
}
