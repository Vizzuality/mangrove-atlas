import { format, formatPrefix } from 'd3-format';

export const formatNumberNearestInteger = format(',.0f');
export const numberFormat = format(',.2f');
export const formatAxis = format(',.0d');
export const formatMillion = formatPrefix(',.0', 1e6);
export const significantDigitsFormat = format('.3s');
