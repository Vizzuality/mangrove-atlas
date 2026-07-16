import { format, formatPrefix } from 'd3-format';

// Max decimals to prevent absurd precision on extreme tiny values.
const MAX_ADAPTIVE_DECIMALS = 8;

/**
 * Format `value` with at least `minDecimals` decimals. When the value is small enough
 * that fixed `minDecimals` precision would hide or distort it (e.g. 0.006 → "0.01",
 * 0.003 → "0.00"), add just enough decimals to surface ~2 significant figures so the
 * real value stays visible: 0.006 → "0.006", 0.003 → "0.003". Works for positive and
 * negative values alike (sign preserved by d3). Normal-range values keep their exact
 * current look — trailing zeros are only trimmed on the expanded (small-value) branch.
 */
export const adaptiveFormat = (value: number, minDecimals = 2): string => {
  if (!Number.isFinite(value) || value === 0) return format(`,.${minDecimals}f`)(value);
  const abs = Math.abs(value);
  // Decimals needed to surface ~2 significant figures for sub-unit magnitudes.
  const sigFigDecimals = Math.floor(-Math.log10(abs)) + 2;
  const decimals = Math.min(Math.max(minDecimals, sigFigDecimals), MAX_ADAPTIVE_DECIMALS);
  // Only expand (and trim) when the value needs more precision than the fixed baseline;
  // otherwise keep the exact fixed format so normal values render identically to before.
  return decimals > minDecimals
    ? format(`,.${decimals}~f`)(value)
    : format(`,.${minDecimals}f`)(value);
};

export const formatNumberNearestInteger = (value: number) => adaptiveFormat(value, 0);
export const numberFormat = (value: number) => adaptiveFormat(value, 2);
export const formatAxis = format(',.0d');
export const formatMillion = formatPrefix(',.0', 1e6);
export const significantDigitsFormat = format('.3s');
