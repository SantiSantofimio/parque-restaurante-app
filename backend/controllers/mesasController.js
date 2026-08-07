import mesasService from '../services/mesasService.js'

export function obtenerMesas(
  req,
  res
) {

    const mesas = mesasService.obtenerMesas(
        req.query.personas
    )

    return res.json(mesas)

}

export function obtenerMesa(
  req,
  res
) {

    const mesa = mesasService.obtenerMesa(
        req.params.mesaId
    )

    return res.json(mesa)

}

export function entrarAMesa(
  req,
  res
) {

    const resultado = mesasService.entrarAMesa(
        req.params.mesaId,
        req.user
    )

    return res.json(resultado)

}

export function salirDeMesa(
  req,
  res
) {

    const resultado = mesasService.salirDeMesa(
        req.params.mesaId,
        req.user
    )

    return res.json(resultado)

}

export function confirmarPedido(
  req,
  res
) {

    const resultado = mesasService.confirmarPedido(
        req.params.mesaId,
        req.user,
        req.body.productos
    )

    return res
        .status(201)
        .json(resultado)
        
}