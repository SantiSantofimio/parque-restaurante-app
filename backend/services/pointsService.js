import usersRepository
  from '../repositories/usersRepository.js'

import pointsRepository
  from '../repositories/pointsRepository.js'

import NotFoundError
  from '../errors/NotFoundError.js'

const pointsService = {

  obtenerPuntosUsuario(
    userId
  ) {

    const usuario =
      usersRepository.findById(
        userId
      )

    if (!usuario) {

      throw new NotFoundError(
        'Usuario no encontrado'
      )

    }

    const history =
      pointsRepository.getAll()

    const movimientos =
      history.filter(
        movimiento =>
          movimiento.userId ===
          userId
      )

    return {

      puntos:
        usuario.puntos ?? 0,

      historial:
        movimientos,

    }

  },

}

export default pointsService