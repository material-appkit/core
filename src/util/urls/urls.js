import { pathToRegexp, compile } from 'path-to-regexp';
import { rstrip } from '../string';

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;


/**
 *
 * @param {String} path
 * @param {Object} options
 * @returns {Object}
 */
function compilePath(path, options) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

  if (pathCache[path]) {
    return pathCache[path];
  }

  const keys = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = { regexp, keys };

  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }

  return result;
}


/**
 *
 * @summary
 * Public API for matching a URL pathname to a path.
 *
 * @param {String} pathname
 *
 * @param {Object} options
 *
 * @attribution
 * https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/matchPath.js
 */
export function matchPath(pathname, options = {}) {
  if (typeof options === "string" || Array.isArray(options)) {
    options = { path: options };
  }

  const { path, exact = false, strict = false, sensitive = false } = options;

  const paths = [].concat(path);

  return paths.reduce((matched, path) => {
    if (!path && path !== "") return null;
    if (matched) return matched;

    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive
    });
    const match = regexp.exec(pathname);

    if (!match) {
      return null;
    }

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      path, // the path used to match
      url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}


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
