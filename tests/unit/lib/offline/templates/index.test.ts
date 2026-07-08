import { collectCacheableTemplates, type StyleReader } from '@/lib/offline/templates';

const GCS = 'https://storage.googleapis.com/mangrove_atlas/tilesets/extent/v3/2020/{z}/{x}/{y}.png';
const GCS_SUBDOMAIN =
  'https://mangrove_atlas.storage.googleapis.com/staging/tilesets/height/{z}/{x}/{y}.png';
const MAPBOX = 'https://a.tiles.mapbox.com/v4/globalmangrovewatch.foo/{z}/{x}/{y}.png';

type Src = { tiles?: string[] };
type Layer = {
  source?: string;
  layout?: { visibility?: 'visible' | 'none' };
  paint?: Record<string, unknown>;
};

// Minimal fake of the mapbox-gl style shape collectCacheableTemplates reads.
const style = (sources: Record<string, Src>, layers: Layer[]): StyleReader => ({
  getStyle: () => ({ sources, layers }),
});

describe('collectCacheableTemplates', () => {
  it('includes a GCS raster source drawn by a visible layer', () => {
    const result = collectCacheableTemplates(
      style({ extent: { tiles: [GCS] } }, [{ source: 'extent', paint: { 'raster-opacity': 1 } }])
    );
    expect(result).toContain(GCS);
  });

  it('accepts the storage.googleapis.com subdomain host', () => {
    const result = collectCacheableTemplates(
      style({ height: { tiles: [GCS_SUBDOMAIN] } }, [{ source: 'height' }])
    );
    expect(result).toContain(GCS_SUBDOMAIN);
  });

  it('never caches Mapbox-hosted tiles (TOS)', () => {
    const result = collectCacheableTemplates(
      style({ mbx: { tiles: [MAPBOX] } }, [{ source: 'mbx' }])
    );
    expect(result).not.toContain(MAPBOX);
  });

  it('excludes a source no layer draws from (dormant / removed)', () => {
    const result = collectCacheableTemplates(style({ extent: { tiles: [GCS] } }, []));
    expect(result).not.toContain(GCS);
  });

  it('excludes a source whose only layer is visibility:none', () => {
    const result = collectCacheableTemplates(
      style({ extent: { tiles: [GCS] } }, [{ source: 'extent', layout: { visibility: 'none' } }])
    );
    expect(result).not.toContain(GCS);
  });

  it('excludes a source painted at numeric opacity 0 (inactive per-year tileset)', () => {
    const result = collectCacheableTemplates(
      style({ extent: { tiles: [GCS] } }, [{ source: 'extent', paint: { 'fill-opacity': 0 } }])
    );
    expect(result).not.toContain(GCS);
  });

  it('keeps a source if any of its layers is visible (one hidden, one shown)', () => {
    const result = collectCacheableTemplates(
      style({ extent: { tiles: [GCS] } }, [
        { source: 'extent', paint: { 'fill-opacity': 0 } },
        { source: 'extent', paint: { 'line-opacity': 1 } },
      ])
    );
    expect(result).toContain(GCS);
  });

  it('treats an opacity expression (not a numeric 0) as drawn', () => {
    const result = collectCacheableTemplates(
      style({ extent: { tiles: [GCS] } }, [
        {
          source: 'extent',
          paint: { 'raster-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1] },
        },
      ])
    );
    expect(result).toContain(GCS);
  });

  it('is safe when the style is unavailable', () => {
    expect(collectCacheableTemplates(undefined)).toEqual(expect.any(Array));
    expect(collectCacheableTemplates({ getStyle: () => undefined })).toEqual(expect.any(Array));
  });
});
