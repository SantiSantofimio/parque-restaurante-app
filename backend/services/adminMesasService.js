import mesasRepository
  from '../repositories/mesasRepository.js'

import NotFoundError
  from '../errors/NotFoundError.js'


const adminMesasService = {

  obtenerMesas() {

    const mesas =
      mesasRepository.getAll()

    const mesasAdministrativas =
      mesas.map(
        mesa =>
          this.transformarMesa(
            mesa
          )
      )

    return {

      mesas:
        mesasAdministrativas,

      resumen:
        this.obtenerResumen(
          mesasAdministrativas
        ),

    }

  },


  obtenerMesa(
    mesaId
  ) {

    const mesa =
      mesasRepository.findById(
        mesaId
      )

    if (!mesa) {

      throw new NotFoundError(
        'Mesa no encontrada'
      )

    }

    return this.transformarMesa(
      mesa
    )

  },


  transformarMesa(
    mesa
  ) {

    const usuarios =
      Array.isArray(
        mesa.usuarios
      )
        ? mesa.usuarios
        : []

    const pedidos =
      Array.isArray(
        mesa.pedidos
      )
        ? mesa.pedidos
        : []

    const consumo =
      pedidos.reduce(
        (
          total,
          pedido
        ) =>
          total +
          Number(
            pedido.total || 0
          ),
        0
      )

    return {

      id:
        mesa.id,

      capacidad:
        mesa.capacidad,

      ocupada:
        usuarios.length > 0,

      usuarios,

      pedidos,

      ocupacion:
        usuarios.length,

      consumo,

    }

  },


  obtenerResumen(
    mesas
  ) {

    const total =
      mesas.length

    const ocupadas =
      mesas.filter(
        mesa =>
          mesa.ocupada
      ).length

    const disponibles =
      total -
      ocupadas

    const pedidosActivos =
      mesas.reduce(
        (
          total,
          mesa
        ) =>
          total +
          mesa.pedidos.length,
        0
      )

    const consumoActivo =
      mesas.reduce(
        (
          total,
          mesa
        ) =>
          total +
          mesa.consumo,
        0
      )

    return {

      total,

      ocupadas,

      disponibles,

      pedidosActivos,

      consumoActivo,

    }

  },

}


export default
  adminMesasService