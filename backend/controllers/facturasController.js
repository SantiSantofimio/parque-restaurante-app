import facturasService
  from '../services/facturasService.js'

export function pagarPedidos(
  req,
  res
) {

  const resultado =
    facturasService.pagarPedidos(
      req.user,
      req.body.mesaId,
      req.body.tipoPago
    )

  return res.json(
    resultado
  )

}

export function obtenerFacturas(
  req,
  res
) {

  const facturas =
    facturasService.obtenerFacturasUsuario(
      req.user.id
    )

  return res.json(
    facturas
  )

}