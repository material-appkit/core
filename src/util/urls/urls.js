import { pathToRegexp, compile } from 'path-to-regexp';

export function reverse(path, params) {
  const toPath = compile(path);
  return toPath(params);
}

/**
 * Public API for matching a URL pathname to a path.
 * Source: https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/matchPath.js
 */
function matchPath(pathname, options = {}) {
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

    if (!match) return null;

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


export function matchesForPath(pathname, routes) {
  const matches = [];
  routes.forEach((routeInfo) => {
    const currentMatch = matchPath(pathname, { path: routeInfo.path });
    if (currentMatch) {
      matches.push({...currentMatch, ...routeInfo });
    }
  });
  return matches;
}
