export default function looseJsonParse(obj) {
  // eslint-disable-next-line no-new-func
  return Function(`"use strict";return (${obj})`)();
}
