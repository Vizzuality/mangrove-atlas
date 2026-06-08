import { locationQueryOptions } from '@/containers/datasets/locations/hooks';

describe('locationQueryOptions', () => {
  it('builds a query key from location type + id', () => {
    const options = locationQueryOptions('country', 'NGA');
    expect(options.queryKey).toEqual(['location', 'country', 'NGA']);
    expect(typeof options.queryFn).toBe('function');
  });
});
