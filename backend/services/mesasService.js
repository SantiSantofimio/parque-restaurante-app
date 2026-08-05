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

}

export default mesasService