/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cdn.discordapp.com',
      "media.discordapp.net",
      "d1fnc2wv9zomi3.cloudfront.net",
      "viaprompt.b-cdn.net"],
  },
}

module.exports = nextConfig
