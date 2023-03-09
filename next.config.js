/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.discordapp.com', "media.discordapp.net"],
    // path: 'https://media.discordapp.net/attachments/'
  },
}

module.exports = nextConfig
