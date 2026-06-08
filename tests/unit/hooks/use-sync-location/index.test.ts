import { parse } from '@/hooks/use-sync-location';

describe('parse (pathname → location)', () => {
  it('returns nulls for the root path', () => {
    expect(parse('/')).toEqual({ type: null, id: null });
  });

  it('parses each location segment + id', () => {
    expect(parse('/country/NGA')).toEqual({ type: 'country', id: 'NGA' });
    expect(parse('/wdpa/123')).toEqual({ type: 'wdpa', id: '123' });
    expect(parse('/custom-area/abc')).toEqual({ type: 'custom-area', id: 'abc' });
  });

  it('strips the /embedded and /print-report prefixes', () => {
    expect(parse('/embedded/country/NGA')).toEqual({ type: 'country', id: 'NGA' });
    expect(parse('/print-report/wdpa/5')).toEqual({ type: 'wdpa', id: '5' });
  });

  it('returns id null when the segment has no id', () => {
    expect(parse('/country')).toEqual({ type: 'country', id: null });
  });

  it('returns nulls for an unknown segment', () => {
    expect(parse('/something')).toEqual({ type: null, id: null });
  });
});
