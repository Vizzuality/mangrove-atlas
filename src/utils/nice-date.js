import moment from 'moment';

export function dmy(strings, ...vars) {
  const [format] = strings;
  const [date] = vars;
  return moment.utc(date).format(format);
}

export function year(date) {
  return moment(date).year();
}

export function month(date) {
  return moment(date).month();
}

export default dmy;
