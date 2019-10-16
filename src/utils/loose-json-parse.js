export default function looseJsonParse(obj) {
  // eslint-disable-next-line
  return Function(`"use strict";return (${obj})`)();
}
