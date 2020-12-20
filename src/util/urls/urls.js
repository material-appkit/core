import { pathToRegexp, compile } from 'path-to-regexp';
import { matchPath } from 'react-router-dom';

export function reverse(path, params) {
  const toPath = compile(path);
  return toPath(params);
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
