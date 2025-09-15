const { ADMIN_URL, POS_URL } = process.env;
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    config.cache = false; // Disable caching to prevent the error
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/admin",
        destination: `${ADMIN_URL}`,
      },
      {
        source: "/admin/:path+",
        destination: `${ADMIN_URL}/:path+`,
      },
      {
        source: "/admin-static/_next/:path+",
        destination: `${ADMIN_URL}/admin-static/_next/:path+`,
      },
      {
        source: "/pos",
        destination: `${POS_URL}`,
      },
      {
        source: "/pos/:path+",
        destination: `${POS_URL}/:path+`,
      },
      {
        source: "/pos-static/_next/:path+",
        destination: `${POS_URL}/pos-static/_next/:path+`,
      },
    ];
  },
};

module.exports = nextConfig;
