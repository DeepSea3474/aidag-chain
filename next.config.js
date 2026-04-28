/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false, // SWC derleyicisini kapatır
  images: { unoptimized: true },
  // SoulwareAI ve orchestrator için gereken diğer ayarlar buraya gelecek
};

module.exports = nextConfig;

