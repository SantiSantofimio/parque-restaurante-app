import jwt from 'jsonwebtoken'

const JWT_SECRET = 'super_secret_key'

function authMiddleware(
  req,
  res,
  next
) {

  console.log(
    'HEADERS:',
    req.headers
  )

  const authHeader =
    req.headers.authorization

  console.log( 
    'AUTH HEADER:',
    authHeader
  )

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

  console.log('TOKEN:', token)

  try {
    const decode = jwt.verify(
      token,
      JWT_SECRET
    )

    console.log('DECODED TOKEN:', decode)

    req.user = decode

    next()
  } catch (error) {
    console.log('ERROR JWT:', error.message)
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