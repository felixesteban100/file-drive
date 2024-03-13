/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // protocol: "https",
        hostname: "quiet-cat-155.convex.cloud",
        // port: "",
        // pathname: "/account123/**",
      },
    ],
  },
};

export default nextConfig;
