/**
 * Builds the publishable STAC tree from stac/definitions/*.json.
 *
 * Outputs (committed, diff-reviewable):
 *   stac/dist/catalog.json                       — root catalog (child links)
 *   stac/dist/collections/<id>/collection.json   — one per definition
 *   stac/dist/catalog-compiled.json              — root + all collections inlined
 *                                                  under `gmw:collections` (single
 *                                                  fetch for the app)
 *
 * All links are relative so the same tree can be uploaded to the staging and
 * production prefixes of the bucket unchanged.
 */
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DEFINITIONS_DIR = path.join(ROOT, 'stac/definitions');
const DIST_DIR = path.join(ROOT, 'stac/dist');

const STAC_VERSION = '1.0.0';
const WEB_MAP_LINKS_EXT = 'https://stac-extensions.github.io/web-map-links/v1.2.0/schema.json';

const CATALOG_ID = 'gmw';
const CATALOG_TITLE = 'Global Mangrove Watch — map layer catalog';
const CATALOG_DESCRIPTION =
  'STAC catalog of the map layer sources used by the Global Mangrove Watch platform: ' +
  'Mapbox vector tilesets and raster XYZ tilesets hosted on Google Cloud Storage.';

const isRasterXyz = (source) => source.type === 'raster' && Array.isArray(source.tiles);
const isVectorTileset = (source) =>
  source.type === 'vector' && typeof source.url === 'string' && source.url.startsWith('mapbox://');

/** Substitute non-{z}{x}{y} placeholders with the first allowed value, for preview links. */
function previewHref(template, params = {}) {
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    if (['z', 'x', 'y'].includes(name)) return match;
    const values = params[name]?.values;
    if (!values?.length) return match;
    const value = values[values.length - 1];
    return String(params[name]?.substitutions?.[value] ?? value);
  });
}

function toCollection(definition) {
  const { 'gmw:sources': sources = [], links: extraLinks = [], assets = {}, ...rest } = definition;

  const links = [
    { rel: 'root', href: '../../catalog.json', type: 'application/json' },
    { rel: 'parent', href: '../../catalog.json', type: 'application/json' },
    ...extraLinks,
  ];
  const derivedAssets = { ...assets };
  const extensions = new Set(definition.stac_extensions ?? []);

  for (const source of sources) {
    if (isRasterXyz(source)) {
      extensions.add(WEB_MAP_LINKS_EXT);
      for (const template of source.tiles) {
        links.push({
          rel: 'xyz',
          href: previewHref(template, source.params),
          type: 'image/png',
          title: `${definition.title} (XYZ tiles)`,
        });
      }
    }
    if (isVectorTileset(source)) {
      derivedAssets[source.id] = {
        href: source.url,
        type: 'application/vnd.mapbox-vector-tile',
        title: source['gmw:source_layer']
          ? `Mapbox vector tileset (source layer: ${source['gmw:source_layer']})`
          : 'Mapbox vector tileset',
        roles: ['data'],
      };
    }
  }

  return {
    type: 'Collection',
    stac_version: STAC_VERSION,
    ...(extensions.size ? { stac_extensions: [...extensions].sort() } : {}),
    ...rest,
    'gmw:sources': sources,
    ...(Object.keys(derivedAssets).length ? { assets: derivedAssets } : {}),
    links,
  };
}

async function build() {
  const files = (await readdir(DEFINITIONS_DIR)).filter((f) => f.endsWith('.json')).sort();
  if (!files.length) throw new Error(`No definitions found in ${DEFINITIONS_DIR}`);

  const collections = [];
  for (const file of files) {
    const definition = JSON.parse(await readFile(path.join(DEFINITIONS_DIR, file), 'utf8'));
    if (!definition.id) throw new Error(`${file}: missing "id"`);
    collections.push(toCollection(definition));
  }

  const catalog = {
    type: 'Catalog',
    stac_version: STAC_VERSION,
    id: CATALOG_ID,
    title: CATALOG_TITLE,
    description: CATALOG_DESCRIPTION,
    links: [
      { rel: 'root', href: './catalog.json', type: 'application/json' },
      { rel: 'self', href: './catalog.json', type: 'application/json' },
      ...collections.map((c) => ({
        rel: 'child',
        href: `./collections/${c.id}/collection.json`,
        type: 'application/json',
        title: c.title,
      })),
    ],
  };

  await rm(DIST_DIR, { recursive: true, force: true });
  await mkdir(DIST_DIR, { recursive: true });
  await writeFile(path.join(DIST_DIR, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`);

  for (const collection of collections) {
    const dir = path.join(DIST_DIR, 'collections', collection.id);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'collection.json'), `${JSON.stringify(collection, null, 2)}\n`);
  }

  const compiled = { ...catalog, links: catalog.links.slice(0, 2), 'gmw:collections': collections };
  await writeFile(
    path.join(DIST_DIR, 'catalog-compiled.json'),
    `${JSON.stringify(compiled, null, 2)}\n`
  );

  console.log(`Built ${collections.length} collections into ${path.relative(ROOT, DIST_DIR)}`);
}

await build();
