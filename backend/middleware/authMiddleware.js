import { verifyToken } from '../utils/jwt.js'

function authMiddleware(
  req,
  res,
  next
) {
  const authHeader =
    req.headers.authorization

  if (
    !authHeader ||
    !authHeader.startsWith(
      'Bearer '
    )
  ) {
    return res
      .status(401)
      .json({
        error:
          'No autorizado',
      })
  }

  const token =
    authHeader.slice(7)

  try {
    const decoded =
      verifyToken(token)

    req.user =
      decoded

    next()
  } catch {
    return res
      .status(401)
      .json({
        error:
          'Token inválido o expirado',
      })
  }
}

export default authMiddleware