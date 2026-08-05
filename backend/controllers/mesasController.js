import mesasRepository from '../repositories/mesasRepository.js'

import menuRepository from '../repositories/menuRepository.js'

import mesasService from '../services/mesasService.js'

export function obtenerMesas(
  req,
  res
) {

  try {
    const mesas = mesasService.obtenerMesas(
      req.query.personas
    )

    return res.json(
      mesas
    )

  } catch (error) {

    return res
      .status(400)
      .json({
        error:
          error.message,
      })
  }

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

    try {

        const resultado = mesasService.entrarAMesa(
            req.params.mesaId,
            req.user
        )
        
        return res.json(
            resultado
        )

    } catch (error) {

        const mensaje = error.mensaje

        let status = 400

        if (
            mensaje ===
            'Usuario no autenticado'
        ) {

            status = 401

        } else if (
            mensaje ===
            'Mesa no encontrada'
        ) {

            status = 404

        }

        return res 
            .status(status)
            .json({
                error: mensaje,
            })
        
    }
}

export function salirDeMesa(
  req,
  res
) {

    try {

        const resultado = mesasService.salirDeMesa(
            req.params.mesaId,
            req.user
        )

        return res.json(
            resultado
        )

    } catch (error) {

        const mensaje = error.mensaje

        let status = 400

        if (
            mensaje ===
            'Usuario no autenticado'
        ) {

            status = 401

        } else if (
            mensaje ===
            'Mesa no encontrada'
        ) {

            status = 404

        }

        return res 
            .status(status)
            .json({
                error: mensaje,
            })
        
    }
}

export function confirmarPedido(
  req,
  res
) {

  const {
    mesaId,
  } = req.params

  const {
    productos,
  } = req.body

  const userId =
    req.user.id

    // ============================
    // Validar carrito
    // ============================

    if (
      !Array.isArray(productos) ||
      productos.length === 0
    ) {
      return res
        .status(400)
        .json({
          error:
            'El carrito está vacío',
        })
    }
    const mesa =
      mesasRepository.findById(
        mesaId
      )

    // ============================
    // Validar mesa
    // ============================

    if (!mesa) {
      return res
        .status(404)
        .json({
          error:
            'Mesa no encontrada',
        })
    }

    // ============================
    // Validar usuario en mesa
    // ============================

    const usuarioEnMesa =
      mesa.usuarios.some(
        usuario =>
          String(usuario.id) ===
          String(userId)
      )

    if (!usuarioEnMesa) {
      return res
        .status(403)
        .json({
          error:
            'No perteneces a esta mesa',
        })
    }

    // ============================
    // Leer menú real
    // ============================


    if (!mesa.pedidos) {
      mesa.pedidos = []
    }

    // ============================
    // Procesar productos
    // ============================

    for (
      const item of productos
    ) {

      const cantidad =
        Number(item.cantidad)

      // Validar cantidad
      if (!Number.isInteger(cantidad) || 
        cantidad <= 0
      ) {
        return res
          .status(400)
          .json({
            error:
              'Cantidad de producto inválida',
          })
      }

      // Buscar producto real
      const productoReal = menuRepository.findById(
        item.productoId
      )

      if (!productoReal) {
        return res
          .status(400)
          .json({
            error:
              `Producto ${item.productoId} no encontrado`,
          })
      }

      if (
        productoReal.disponible ===
        false
      ) {
        return res
          .status(400)
          .json({
            error:
              `${productoReal.nombre} no está disponible`,
          })
      }

      // ============================
      // Crear pedido
      // ============================

      const nuevoPedido = {
        id:
          Date.now() +
          Math.floor(
            Math.random() *
            100000
          ),
        
        userId:
          req.user.id,

        userName:
          req.user.name,

        productoId:
          String(
            productoReal.id
          ),

        producto:
          productoReal.nombre,

        precio:
          productoReal.precio,

        cantidad,

        total:
          productoReal.precio *
          cantidad,

        observaciones:
          item.observaciones ||
          '',
      }

      mesa.pedidos.push(
        nuevoPedido
      )
    }

    // ============================
    // Guardar mesa
    // ============================

    mesasRepository.update(mesa)

    // ============================
    // Respuesta
    // ============================

    return res
      .status(201)
      .json({
        message:
          'Pedido confirmado correctamente',

        mesa,
      })
  
}