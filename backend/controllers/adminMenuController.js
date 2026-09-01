import adminMenuService
  from '../services/adminMenuService.js'


export function obtenerMenuAdmin(
  req,
  res
) {

  const resultado =
    adminMenuService.obtenerMenu()

  return res.json(
    resultado
  )

}


export function crearProductoAdmin(
  req,
  res
) {

  const producto =
    adminMenuService.crearProducto(
      req.body
    )

  return res
    .status(201)
    .json({

      message:
        'Producto creado correctamente',

      producto,

    })

}


export function actualizarProductoAdmin(
  req,
  res
) {

  const producto =
    adminMenuService.actualizarProducto(
      req.params.productId,
      req.body
    )

  return res.json({

    message:
      'Producto actualizado correctamente',

    producto,

  })

}

export function cambiarDisponibilidadAdmin(
  req,
  res
) {

  const producto =
    adminMenuService.cambiarDisponibilidad(
      req.params.productId,
      req.body.disponible
    )

  return res.json({

    message:
      producto.disponible
        ? 'Producto activado correctamente'
        : 'Producto desactivado correctamente',

    producto,

  })

}