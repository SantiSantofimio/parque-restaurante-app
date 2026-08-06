import mesasRepository
  from '../repositories/mesasRepository.js'

import menuRepository
  from '../repositories/menuRepository.js'

const mesasService = {

  obtenerMesas(
    personas
  ) {

    if (!personas) {
      return mesasRepository.getAll()
    }

    const cantidad =
      Number(personas)

    if (
      Number.isNaN(cantidad) ||
      cantidad < 1
    ) {
      throw new Error(
        'Cantidad de personas inválida'
      )
    }

    return mesasRepository.findAvailable(
      cantidad
    )

  },

  obtenerMesa(
    mesaId
    ) {

        const mesa =
            mesasRepository.findById(
            mesaId
            )

        if (!mesa) {
            throw new Error(
            'Mesa no encontrada'
            )
        }

        return mesa

    },

  entrarAMesa(
    mesaId,
    user
    ) {

        if (
            !user ||
            !user.id
        ) {
            throw new Error(
            'Usuario no autenticado'
            )
        }

        const mesa =
            mesasRepository.findById(
            mesaId
            )

        if (!mesa) {
            throw new Error(
            'Mesa no encontrada'
            )
        }

        const mesaActual =
            mesasRepository.findByUserId(
            user.id
            )

        if (mesaActual) {

            if (
            mesaActual.id === mesaId
            ) {

            return {

                message:
                'Ya perteneces a esta mesa',

                mesa:
                mesaActual,

            }

            }

            throw new Error(
            `Ya perteneces a la ${mesaActual.id}`
            )

        }

        if (
            mesa.usuarios.length >=
            mesa.capacidad
        ) {

            throw new Error(
            'Mesa llena'
            )

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

        return {

            message:
            'Entraste a la mesa',

            mesa,

        }

    },

  salirDeMesa(
    mesaId,
    user
    ) {

        if (
            !user ||
            !user.id
        ) {
            throw new Error(
            'Usuario no autenticado'
            )
        }

        const mesa =
            mesasRepository.findById(
            mesaId
            )

        if (!mesa) {
            throw new Error(
            'Mesa no encontrada'
            )
        }

        const usuarioEnMesa =
            mesa.usuarios.some(
            usuario =>
                usuario.id ===
                user.id
            )

        if (!usuarioEnMesa) {
            throw new Error(
            'No perteneces a esta mesa'
            )
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
            throw new Error(
            'Tienes pedidos pendientes. Debes pagar tu consumo antes de salir de la mesa.'
            )
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

        return {

            message:
            'Saliste de la mesa correctamente',

            mesa,

        }

    },

    confirmarPedido(
        mesaId,
        user,
        productos
    ) {

        // ============================
        // Validar carrito
        // ============================

        if (
            !Array.isArray(productos) ||
            productos.length === 0
        ) {
            throw new Error(
                'El carrito está vacío'
            )
        }

        const mesa =
            mesasRepository.findById(
                mesaId
            )

        // ============================
        // Validar mesa
        // ============================ 

        if (!mesa) {
            throw new Error(
                'Mesa no encontrada'
            )
        }

        // ============================
        // Validar usuario en mesa
        // ============================

        const usuarioEnMesa =
            mesa.usuarios.some(
                usuario =>
                    String(usuario.id) ===
                    String(user.id)
            )

        if (!usuarioEnMesa) {
            throw new Error(
                'No perteneces a esta mesa'
            )
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
                throw new Error(
                    `Cantidad inválida para el producto ${item.productoId}`
                )
            }

            // Buscar producto real
            const productoReal = menuRepository.findById(
                item.productoId
            )

            if (!productoReal) {
                throw new Error(
                    `Producto ${item.productoId} no encontrado`
                )
            }

            if (
                productoReal.disponible ===
                false
            ) {
                throw new Error(
                    `Producto ${productoReal.nombre} no disponible`
                )
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
                    user.id,

                userName:
                    user.name,

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

        return {
            message:
            'Pedido confirmado',
            mesa,
        }

    },

}

export default mesasService