import mesasRepository
  from '../repositories/mesasRepository.js'

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

}

export default mesasService