export const mapOrder = (array, order, key) => {
  return array.sort((a, b) => order.indexOf(a[key]) - order.indexOf(b[key]));
};

