import { buildPath, locationToNavTarget } from '@/hooks/location-navigation';

describe('buildPath', () => {
  it('maps each location type to its path', () => {
    expect(buildPath({ type: 'worldwide' })).toBe('/');
    expect(buildPath({ type: 'country', iso: 'NGA' })).toBe('/country/NGA');
    expect(buildPath({ type: 'wdpa', locationId: 123 })).toBe('/wdpa/123');
    expect(buildPath({ type: 'custom-area' })).toBe('/custom-area');
  });
});

describe('locationToNavTarget', () => {
  it('maps a country location', () => {
    expect(locationToNavTarget({ location_type: 'country', iso: 'BRA', location_id: '1' })).toEqual(
      {
        type: 'country',
        iso: 'BRA',
      }
    );
  });

  it('maps a wdpa location', () => {
    expect(locationToNavTarget({ location_type: 'wdpa', iso: '', location_id: '7' })).toEqual({
      type: 'wdpa',
      locationId: '7',
    });
  });

  it('maps a custom-area location', () => {
    expect(
      locationToNavTarget({ location_type: 'custom-area', iso: '', location_id: '0' })
    ).toEqual({ type: 'custom-area' });
  });

  it('defaults unknown / worldwide to worldwide', () => {
    expect(locationToNavTarget({ location_type: 'worldwide', iso: '', location_id: '0' })).toEqual({
      type: 'worldwide',
    });
    expect(
      locationToNavTarget({ location_type: 'something-else' as never, iso: '', location_id: '0' })
    ).toEqual({ type: 'worldwide' });
  });
});
