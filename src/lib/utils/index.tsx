export const normalize = (s: string) =>
  s
    .normalize('NFKD') // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
    .replace(/[\u0300-\u036f]/g, '') //  Remove accents/diacritics in a string
    .trim()
    .toLowerCase();

export function sortObject(obj: Record<string, string[]>) {
  const compare = (a: string, b: string) => {
    const A = normalize(a);
    const B = normalize(b);
    if (A < B) return -1;
    if (A > B) return 1;
    return 0;
  };

  const sortedEntries = Object.entries(obj)
    .sort(([keyA], [keyB]) => compare(keyA, keyB)) // sort keys
    .map(([key, arr]) => [key, [...arr].sort(compare)]); // sort array values

  return Object.fromEntries(sortedEntries);
}
