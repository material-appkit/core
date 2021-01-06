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
  const lastIndex = string.lastIndexOf(value);
  if (lastIndex !== -1) {
    return str.substring(0, lastIndex);
  }
}

/**
 *
 * @param {String} str
 * String to be converted into title case
 *
 * @returns {String} The given `string`, converted into title case
 */
export function titleCase(str) {
  if (typeof(string) !== 'string') {
    return null;
  }

  const tcString = str.toLowerCase().replace(/ /g, '_').split('_');
  for (let i = 0, n = str.length; i < n; i++) {
    tcString[i] = tcString[i].charAt(0).toUpperCase() + tcString[i].slice(1);
  }
  return tcString.join(' ');
}
