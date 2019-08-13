import moment from 'moment';

export function dmy(strings, ...vars) {
  const [format] = strings;
  const [date] = vars;
  return moment.utc(date).format(format);
}

export function year(date) {
  return moment(date).year();
}

export default dmy;