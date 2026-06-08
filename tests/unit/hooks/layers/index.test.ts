import { updateLayers } from '@/hooks/layers';
import type { Layer } from 'types/layers';

vi.mock('@/lib/analytics/ga', () => ({ trackEvent: vi.fn() }));

const layer = (id: string) => ({ id, opacity: '1', visibility: 'visible' }) as unknown as Layer;

describe('updateLayers', () => {
  it('removes a layer that is already active', () => {
    const active = [layer('a'), layer('b')];
    expect(updateLayers(layer('a'), active)).toEqual([layer('b')]);
  });

  it('prepends a layer that is not active', () => {
    const active = [layer('b')];
    expect(updateLayers(layer('z'), active)).toEqual([layer('z'), layer('b')]);
  });

  it('adds to an empty active list', () => {
    expect(updateLayers(layer('a'), [])).toEqual([layer('a')]);
  });
});
