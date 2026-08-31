import type { NextConfig } from 'next'

const isGitHubPages =
  process.env.GITHUB_PAGES === 'true'

const repoName =
  'parque-restaurante-app'

const basePath =
  isGitHubPages
    ? `/${repoName}`
    : ''

const nextConfig: NextConfig = {

  trailingSlash: true,

  basePath,

  assetPrefix:
    isGitHubPages
      ? `${basePath}/`
      : undefined,

  images: {
    unoptimized: true,
  },

  env: {
    NEXT_PUBLIC_BASE_PATH:
      basePath,
  },
}

export default nextConfig