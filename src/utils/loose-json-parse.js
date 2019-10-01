export default function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ')')();
}