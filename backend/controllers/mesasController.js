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