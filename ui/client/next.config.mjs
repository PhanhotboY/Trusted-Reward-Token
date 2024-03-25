/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: "http://52.187.124.13/api/v1",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
