import jwt from 'jsonwebtoken'

const JWT_SECRET =
  process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET no está configurado'
  )
}

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
      jwt.verify(
        token,
        JWT_SECRET
      )

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