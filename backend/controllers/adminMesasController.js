import adminMesasService
  from '../services/adminMesasService.js'

export function obtenerMesasAdmin(
  req,
  res
) {

  const resultado =
    adminMesasService.obtenerMesas()

  return res.json(
    resultado
  )

}