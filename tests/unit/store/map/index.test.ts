import { parseAsBounds } from '@/store/map';

describe('parseAsBounds', () => {
  it('parses a valid JSON bounds array', () => {
    expect(parseAsBounds.parse('[[-180,-90],[180,90]]')).toEqual([
      [-180, -90],
      [180, 90],
    ]);
  });

  it('returns null for invalid JSON', () => {
    expect(parseAsBounds.parse('not json')).toBeNull();
  });

  it('round-trips through serialize', () => {
    const bounds = [
      [1, 2],
      [3, 4],
    ];
    expect(parseAsBounds.parse(parseAsBounds.serialize(bounds))).toEqual(bounds);
  });
});
