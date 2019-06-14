export function mask(obj, mask) {
  return mask.reduce((acc, prop) => ({
    ...acc,
    [prop]: obj[prop]
  }), {});
}

export default mask;