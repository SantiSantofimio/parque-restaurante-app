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


export function obtenerMesaAdmin(
  req,
  res
) {

  const resultado =
    adminMesasService.obtenerMesa(
      req.params.mesaId
    )

  return res.json(
    resultado
  )

}