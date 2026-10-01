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
  // Standalone output is what the Dockerfile and the Playwright webServer run.
  // On Vercel it is unnecessary and, on every stable Next 16.3.x, breaks the
  // build: 16.3 stopped emitting `.next/next-server.js.nft.json` when an
  // adapter is present and Vercel's onBuildComplete still reads it
  // (vercel/next.js#96646). Fixed upstream in vercel/next.js#98167, not yet
  // released — drop this condition once a 16.3.x/16.4 with it ships.
  output: process.env.VERCEL ? undefined : 'standalone',
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
