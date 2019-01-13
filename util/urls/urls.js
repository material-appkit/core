import pathToRegexp from 'path-to-regexp';

export function reverse(path, params) {
  const toPath = pathToRegexp.compile(path);
  return toPath(params);
}
