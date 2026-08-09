import pointsService
  from '../services/pointsService.js'

export function obtenerPuntos(
  req,
  res
) {

  const resultado =
    pointsService.obtenerPuntosUsuario(
      req.user.id
    )

  return res.json(
    resultado
  )

}