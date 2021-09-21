export function strToHslColor(str, s, l) {
  let hash = 0;
  for (let i = 0, n = str.length; i < n; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return `hsl(${hash % 360}, ${s}%, ${l}%)`;
}
