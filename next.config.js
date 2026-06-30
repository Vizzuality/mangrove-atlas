const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

// Per-build identifier. On Vercel the commit SHA is stable across all instances
// of a deploy; locally it changes every `next build`. It stamps both the Next
// build id and the service-worker registration URL (?v=) so the SW re-installs
// and purges its volatile caches on every deploy — otherwise a fixed-named cache
// would serve last build's HTML/chunks forever (stale-build 500s).
const SW_VERSION = process.env.VERCEL_GIT_COMMIT_SHA || `local-${Date.now()}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  output: 'standalone',
  poweredByHeader: false,
  generateBuildId: async () => SW_VERSION,
  env: {
    // Inlined into the client bundle so register-sw can version the SW per build.
    NEXT_PUBLIC_SW_VERSION: SW_VERSION,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.wetlands.org',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/planet/:path*',
        destination: `https://tiles.planet.com/basemaps/v1/planet-tiles/:path*?api_key=${process.env.NEXT_PUBLIC_PLANET_API_KEY}`,
      },
      {
        source: '/planet-api/:path*',
        destination: `https://api.planet.com/basemaps/v1/:path*?api_key=${process.env.NEXT_PUBLIC_PLANET_API_KEY}`,
      },
      { source: '/blog/:path*', destination: `https://www.wetlands.org/:path*` },
      {
        source: '/proxy/:path*',
        destination: `https://${process.env.NEXT_PUBLIC_MRTT_SITE}/auth/login/:path*`,
      },
    ];
  },

  async headers() {
    // Allow MRTT to load the silent-SSO authorize endpoint in an iframe.
    // Any default frame-blocking header (e.g. X-Frame-Options: DENY emitted
    // by upstream middleware / hosting) would silently break the silent-SSO
    // iframe and cause silentSsoCheck() to time out without diagnostic.
    const mrttOrigin = (() => {
      try {
        return new URL(process.env.NEXT_PUBLIC_MRTT_SITE).origin;
      } catch {
        return null;
      }
    })();

    const rules = [
      // Service worker (offline maps): must not be HTTP-cached so updates ship
      // immediately, and needs root scope to intercept all tile/data requests.
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];

    if (mrttOrigin) {
      // Allow MRTT to load the silent-SSO authorize endpoint in an iframe.
      rules.push({
        source: '/api/auth/sso/authorize',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' ${mrttOrigin};`,
          },
        ],
      });
    }

    return rules;
  },
  turbopack: {
    rules: {
      '*.mdx': {
        loaders: ['@mdx-js/loader'],
        as: '*.jsx',
      },
    },
  },
};

module.exports = withMDX(nextConfig);
