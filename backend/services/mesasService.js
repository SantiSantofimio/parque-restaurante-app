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
            this.validarMesa(
            mesaId
            )

        return mesa

    },

  entrarAMesa(
    mesaId,
    user
    ) {

        this.validarUsuario(
            user
        )

        const mesa =
            this.validarMesa(
            mesaId
            )

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

        this.guardarMesa(
            mesa
        )

        return {

            message:
            'Entraste a la mesa',

            mesa,

        }

    },


    validarMesa(
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


    validarUsuario(
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

    },


    validarUsuarioEnMesa(
        mesa,
        user
    ) {

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

    },


    guardarMesa(
        mesa
    ) {

        mesasRepository.update(
            mesa
        )

    },


    validarProducto(
        productoId
    ) {

        const producto =
            menuRepository.findById(
                productoId
            )

        if (!producto) {

            throw new Error(
                `Producto ${productoId} no encontrado`
            )

        }

        if (
            !producto.disponible
        ) {

            throw new Error(
                `Producto ${producto.nombre} no disponible`
            )

        }

        return producto

    },


    crearPedido(
        producto,
        cantidad,
        observaciones,
        user
    ) {

        return {

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
                    producto.id
                ),

            producto:
                producto.nombre,

            precio:
                producto.precio,

            cantidad,

            total:
                producto.precio *
                cantidad,

            observaciones:
                observaciones || '',

        }

    },


    procesarProductoPedido(
        item,
        user
    ) {

        const cantidad =
            Number(
                item.cantidad
            )

        if (
            !Number.isInteger(
                cantidad
            ) ||
            cantidad <= 0
        ) {

            throw new Error(
                `Cantidad inválida para el producto ${item.productoId}`
            )

        }

        const producto =
            this.validarProducto(
                item.productoId
            )

        return this.crearPedido(
            producto,
            cantidad,
            item.observaciones,
            user
        )

    },


    salirDeMesa(
        mesaId,
        user
    ) {

        this.validarUsuario(
            user
        )

        const mesa =
            this.validarMesa(
            mesaId
            )

        this.validarUsuarioEnMesa(
            mesa,
            user
        )

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

        this.guardarMesa(
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

        this.validarUsuario(
            user
        )

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

        // ============================
        // Validar mesa
        // ============================

        const mesa =
            this.validarMesa(
            mesaId
            )

        // ============================
        // Validar usuario en mesa
        // ============================

        this.validarUsuarioEnMesa(
            mesa,
            user
        )

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

            const pedido =
            this.procesarProductoPedido(
                item,
                user
            )
            mesa.pedidos.push(pedido)
        }

        // ============================
        // Guardar mesa
        // ============================

        this.guardarMesa(
            mesa
        )

        return {
            message:
            'Pedido confirmado',
            mesa,
        }

    },

}

export default mesasService