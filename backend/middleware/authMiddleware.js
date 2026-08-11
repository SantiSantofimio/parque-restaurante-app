import {
  verifyToken,
} from '../utils/jwt.js'

import usersRepository
  from '../repositories/usersRepository.js'

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

    const user =
      usersRepository.findById(
        decoded.id
      )

    if (!user) {

      return res
        .status(401)
        .json({
          error:
            'Usuario no encontrado',
        })

    }

    if (
      user.active === false
    ) {

      return res
        .status(401)
        .json({
          error:
            'La cuenta está desactivada',
        })

    }

    req.user = {

      id:
        user.id,

      name:
        user.name,

      email:
        user.email,

      role:
        user.role ||
        'customer',

    }

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