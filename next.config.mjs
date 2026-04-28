/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  compiler: {
    // SWC'yi tamamen devre dışı bırakmak için boş bırakıyoruz
  },
  experimental: {
    forceSwcTransforms: false,
  },
};

export default nextConfig;
