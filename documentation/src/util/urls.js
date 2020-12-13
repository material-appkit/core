import { compile } from 'path-to-regexp';

export function reverse(path, params) {
  const toPath = compile(path);

  return toPath(params);
}
