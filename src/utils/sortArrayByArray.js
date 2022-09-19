export const  mapOrder = (array, order, key) => array.sort((a, b) => {
      var A = a[key],
        B = b[key];

      return order.indexOf(A) > order.indexOf(B) ? 
       1 : -1;
    });
