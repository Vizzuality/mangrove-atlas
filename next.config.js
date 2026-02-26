const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'fr', 'es'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  productionBrowserSourceMaps: false,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  output: 'standalone',
  poweredByHeader: false,

  async redirects() {
    return [{ source: '/custom-area', destination: '/', permanent: true }];
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
        destination: `https://${
          process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
            ? process.env.NEXT_PUBLIC_MRTT_SITE_PRODUCTION
            : process.env.NEXT_PUBLIC_MRTT_SITE_STAGING
        }/auth/login/:path*`,
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
