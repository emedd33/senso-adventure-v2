/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ["localhost"],
  },
  async redirects() {
    return [
      {
        source: "/campaign",
        destination: "/",
        permanent: true,
      },
      {
        source: "/campaign/:id/session",
        destination: "/",
        permanent: true,
      },
    ];
  },
};
