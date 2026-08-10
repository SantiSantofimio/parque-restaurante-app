import usersRepository
  from '../repositories/usersRepository.js'

import ticketsRepository
  from '../repositories/ticketsRepository.js'

import mesasRepository
  from '../repositories/mesasRepository.js'

const dashboardService = {

  obtenerDashboard(
    userId
  ) {

    const tickets =
      ticketsRepository.getAll()

    const mesas =
      mesasRepository.getAll()

    const user =
      usersRepository.findById(userId)

    const ticketsActivos =
      tickets.filter(
        ticket =>
          ticket.userId === userId &&
          ticket.estado === 'activo'
      ).length

    const mesa =
      mesas.find(
        mesa =>
          mesa.usuarios.some(
            usuario =>
              usuario.id === userId
          )
      )

    return {

      name:
        user?.name ??
        'Usuario',

      puntos:
        user?.puntos ??
        0,

      tickets:
        ticketsActivos,

      mesaActual:
        mesa?.id ??
        null,

      promociones:
        [],

      recomendaciones:
        this.obtenerRecomendaciones(),

    }

  },

  obtenerRecomendaciones() {

    return [

      {
        id: 1,
        titulo: '20% en restaurante',
        descripcion:
          'Disfruta de un 20% de descuento en nuestro restaurante al comprar dos entradas.',
        tipo: 'restaurante',
        image: '/promos/piscina.jpg',
      },

      {
        id: 2,
        titulo: 'Recorrido ecológico',
        descripcion:
          'Explora la naturaleza con un recorrido guiado por nuestro parque ecológico.',
        tipo: 'tour',
        image: '/promos/promocion2.jpg',
      },

    ]

  },

}

export default dashboardService