import jwt from 'jsonwebtoken'

const JWT_SECRET = 'super_secret_key'

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

  const token = authHeader.split(
    'Bearer '
  )[1]

  try {
    const decode = jwt.verify(
      token,
      JWT_SECRET
    )
    req.user = decode

    next()
  } catch {
    return res
      .status(401)
      .json({
        error:
          'Token inválido',
      })
  }
}

export default
  authMiddleware