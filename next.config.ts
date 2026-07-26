import type { NextConfig } from 'next'

const isGitHubPages =
  process.env.GITHUB_PAGES === 'true'

const repoName =
  'parque-restaurante-app'

const nextConfig: NextConfig = {
  output: 'export',

  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  basePath: isGitHubPages
    ? `/${repoName}`
    : '',

  assetPrefix: isGitHubPages
    ? `/${repoName}/`
    : '',
}

export default nextConfig