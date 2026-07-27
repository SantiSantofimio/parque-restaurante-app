const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function appPath(
  path: string
) {
  const normalizedPath =
    path.startsWith('/')
      ? path
      : `/${path}`

  return `${BASE_PATH}${normalizedPath}`
}