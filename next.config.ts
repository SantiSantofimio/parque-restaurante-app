import type { NextConfig } from 'next'

const isGitHubPages =
  process.env.GITHUB_PAGES === 'true'

const basePath =
  '/parque-restaurante-app'

const nextConfig: NextConfig = {
  output: 'export',

  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  basePath: isGitHubPages
    ? basePath
    : '',

  assetPrefix: isGitHubPages
    ? `${basePath}/`
    : '',
}

export default nextConfig