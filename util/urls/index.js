import { pathToRegexp, compile } from 'path-to-regexp';
import { rstrip } from '../string';
import { matchPath } from 'react-router';


/**
 * @param {String} path
 * @param {Object} params
 * @returns {String}
 */
export function reverse(path, params) {
  const toPath = compile(rstrip(path, '/*'));
  return toPath(params);
}


/**
 * @public
 * @param {String} pathname
 * @param {Array} routes
 * @returns {Array}
 */
export function matchesForPath(pathname, routes) {
  const matches = [];
  routes.forEach((routeInfo) => {
    const currentMatch = matchPath(pathname, rstrip(routeInfo.path, '/*'));
    if (currentMatch) {
      matches.push({...currentMatch, ...routeInfo });
    }
  });
  return matches;
}
