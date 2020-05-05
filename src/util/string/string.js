/**
 * Credit:
 * https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
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
 * @param string
 * @param value
 * @returns {*}
 */
export function rstrip(string, value) {
  const lastIndex = string.lastIndexOf(value);
  if (lastIndex !== -1) {
    return string.substring(0, lastIndex);
  }
}

/**
 *
 * @param str
 * @returns {string}
 */
export function titleCase(str) {
  if (typeof(str) !== 'string') {
    return null;
  }

  str = str.toLowerCase().split('_');
  for (let i = 0, n = str.length; i < n; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}
