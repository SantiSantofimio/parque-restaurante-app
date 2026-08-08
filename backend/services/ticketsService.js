import crypto from 'crypto'

import ticketsRepository
  from '../repositories/ticketsRepository.js'

import usersRepository
  from '../repositories/usersRepository.js'

import pointsRepository
  from '../repositories/pointsRepository.js'

import ValidationError
  from '../errors/ValidationError.js'
import NotFoundError
  from '../errors/NotFoundError.js'

const ticketsService = {

    obtenerTicketsUsuario(
        userId
    ) {

        const tickets =
        ticketsRepository.getAll()

        return tickets.filter(
        ticket =>
            ticket.userId === userId
        )

    },

    comprarTicket(
        user,
        datos
    ) {

        const {
            tipo,
            cantidad,
            precio,
        } = datos

        this.validarCompra(
            tipo,
            cantidad,
            precio
        )

        const usuario =
            this.buscarUsuario(
                user.id
            )

        const ticket =
            this.crearTicket(
                usuario,
                tipo,
                cantidad,
                precio
            )

        this.guardarTicket(
            ticket
        )

        this.registrarPuntos(
            usuario,
            ticket
        )

        return {

            ticket,

            puntosTotales:
                usuario.puntos,

        }

    },

    validarCompra(
        tipo,
        cantidad,
        precio
    ) {

        if (!tipo)
        {

            throw new ValidationError('Datos incompletos')

        }

        if (
            !Number.isInteger(
                Number(cantidad)
            ) || 
            Number(cantidad) <= 0
        ) {

            throw new ValidationError('Cantidad inválida')

        }

        if (
            Number(precio) <= 0
        ) {

            throw new ValidationError('Precio inválido')
        }

    },

    buscarUsuario(
        userId
    ) {

        const usuarios =
            usersRepository.getAll()

        const usuario =
            usuarios.find(
                u => u.id === userId
            )

        if (!usuario) {

            throw new NotFoundError('Usuario no encontrado')
        }


        return usuario

    },

    crearTicket(
        usuario,
        tipo,
        cantidad,
        precio
    ) {

        const total =
            cantidad * precio

        return {
            id: `ticket-${Date.now()}`,
            userId: usuario.id,
            tipo,
            cantidad,
            precioUnitario: precio,
            total,
            puntosGanados:
                Math.floor(total / 1000),
            estado: 'activo',
            fechaCompra:
                new Date().toISOString(),
            codigoQR:
                crypto.randomUUID(),
        }
    },

    guardarTicket(
        ticket
    ) {

        const tickets =
            ticketsRepository.getAll()

        tickets.push(ticket)

        ticketsRepository.saveAll(
            tickets
        )
    },

    registrarPuntos(
        usuario,
        ticket
    ) {

        usuario.puntos +=
            ticket.puntosGanados

        const history =
            pointsRepository.getAll()

        history.unshift({
            id: crypto.randomUUID(),
            userId: usuario.id,
            puntos: ticket.puntosGanados,
            descripcion: `Compra de ${ticket.cantidad} ${ticket.tipo}(s)`,
            fecha: new Date().toISOString(),
        })

        pointsRepository.saveAll(history)

        const usuarios =
            usersRepository.getAll()

        const index =
            usuarios.findIndex(
                u => u.id === usuario.id
            )

        usuarios[index] = usuario

        usersRepository.saveAll(
            usuarios
        )

    }

}

export default ticketsService