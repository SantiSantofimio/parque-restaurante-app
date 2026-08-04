import mesasRepository from '../repositories/mesasRepository.js'

export function obtenerMesas(
  req,
  res
) {

  const {
    personas,
  } = req.query

  const mesas =
    mesasRepository.getAll()

  if (
    !personas
  ) {
    return res.json(
      mesas
    )
  }

  const cantidad =
    Number(
      personas
    )

  if (
    Number.isNaN(
      cantidad
    ) ||
    cantidad < 1
  ) {

    return res
      .status(400)
      .json({
        error:
          'Cantidad de personas inválida',
      })

  }

  const disponibles =
    mesasRepository.findAvailable(
      cantidad
    )

  return res.json(
    disponibles
  )

}

export function obtenerMesa(
  req,
  res
) {

  const {
    mesaId,
  } = req.params

  const mesa =
    mesasRepository.findById(
      mesaId
    )

  if (!mesa) {

    return res
      .status(404)
      .json({
        error:
          'Mesa no encontrada',
      })

  }

  return res.json(
    mesa
  )

}

export function entrarAMesa(
  req,
  res
) {

  const {
    mesaId,
  } = req.params

  const user =
    req.user

  if (
    !user ||
    !user.id
  ) {

    return res
      .status(401)
      .json({
        error:
          'Usuario no autenticado',
      })

  }

  const mesa =
    mesasRepository.findById(
      mesaId
    )

  if (!mesa) {

    return res
      .status(404)
      .json({
        error:
          'Mesa no encontrada',
      })

  }

  const mesaActual =
    mesasRepository.findByUserId(
      user.id
    )

  if (mesaActual) {

    if (
      mesaActual.id ===
      mesaId
    ) {

      return res.json({

        message:
          'Ya perteneces a esta mesa',

        mesa:
          mesaActual,

      })

    }

    return res
      .status(400)
      .json({

        error:
          `Ya perteneces a la ${mesaActual.id}`,

      })

  }

  if (
    mesa.usuarios.length >=
    mesa.capacidad
  ) {

    return res
      .status(400)
      .json({
        error:
          'Mesa llena',
      })

  }

  mesa.usuarios.push({

    id:
      user.id,

    name:
      user.name,

  })

  mesa.ocupada = true

  mesasRepository.update(
    mesa
  )

  return res.json({

    message:
      'Entraste a la mesa',

    mesa,

  })

}