const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  output: 'standalone',
  poweredByHeader: false,

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

    if (!mrttOrigin) return [];

    return [
      {
        source: '/api/auth/sso/authorize',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' ${mrttOrigin};`,
          },
        ],
      },
    ];
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
