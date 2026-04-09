const imageHost = process.env.NEXT_PUBLIC_IMAGE_HOST;
const imagePort = process.env.NEXT_PUBLIC_IMAGE_PORT;
const imageProtocol = process.env.NEXT_PUBLIC_IMAGE_PROTOCOL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  // Development only
  images: {
    dangerouslyAllowLocalIP: true,
  remotePatterns: [
    {
      protocol: imageProtocol,
      hostname: imageHost,
      port: imagePort,
      pathname: '/images/**',
    },
    {
      protocol: 'https',
      hostname: 'localhost',
      port: '7129',
      pathname: '/images/**',
    },
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '5033',
      pathname: '/images/**',
    },
  ],
},
};

export default nextConfig;
