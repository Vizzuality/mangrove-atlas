import { getFormattedValue } from '@/containers/datasets/flood-protection/hooks';

describe('getFormattedValue', () => {
  describe('population', () => {
    it('uses a millions prefix above 1,000,000', () => {
      expect(getFormattedValue(2_000_000, 'population')).toBe('2M');
    });

    it('uses a thousands-separated integer below 1,000,000', () => {
      expect(getFormattedValue(1500, 'population')).toBe('1,500');
    });
  });

  describe('area / stock', () => {
    it('uses a millions prefix above 1,000,000', () => {
      expect(getFormattedValue(2_000_000, 'stock')).toBe('2M');
    });

    it('returns even values unchanged', () => {
      expect(getFormattedValue(4, 'area')).toBe(4);
    });

    it('formats odd values with two decimals', () => {
      expect(getFormattedValue(3, 'area')).toBe('3.00');
    });
  });
});
