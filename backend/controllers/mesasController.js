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

export function salirDeMesa(
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

  const usuarioEnMesa =
    mesa.usuarios.some(
      usuario =>
        usuario.id ===
        user.id
    )

  if (!usuarioEnMesa) {

    return res
      .status(400)
      .json({
        error:
          'No perteneces a esta mesa',
      })

  }

  const pedidosUsuario =
    (
      mesa.pedidos || []
    ).filter(
      pedido =>
        pedido.userId ===
        user.id
    )

  if (
    pedidosUsuario.length > 0
  ) {

    return res
      .status(400)
      .json({

        error:
          'Tienes pedidos pendientes. Debes pagar tu consumo antes de salir de la mesa.',

      })

  }

  mesa.usuarios =
    mesa.usuarios.filter(
      usuario =>
        usuario.id !==
        user.id
    )

  if (
    mesa.usuarios.length === 0
  ) {

    mesa.usuarios = []

    mesa.pedidos = []

    mesa.ocupada = false

  } else {

    mesa.ocupada = true

  }

  mesasRepository.update(
    mesa
  )

  return res.json({

    message:
      'Saliste de la mesa correctamente',

    mesa,

  })

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

    const menu = menuRepository.getAll()

    if (!menu.length) {
      return res
        .status(500)
        .json({
          error:
            'El menú no está disponible',
        })
    }

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
      if (
        !Number.isInteger(
          cantidad
        ) ||
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