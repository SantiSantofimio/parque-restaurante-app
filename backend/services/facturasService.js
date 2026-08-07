import facturasRepository from '../repositories/facturasRepository.js'
import mesasRepository from '../repositories/mesasRepository.js'

import mesasService from '../services/mesasService.js'

import ValidationError from '../errors/ValidationError.js'
import ForbiddenError from '../errors/ForbiddenError.js'

const facturasService = {

    obtenerFacturasUsuario(
        userId
    ) {

        const facturas =
        facturasRepository.getAll()

        return facturas.filter(
        factura =>
            factura.user?.id ===
            userId
        )

    },

    pagarPedidos(
        user,
        mesaId,
        tipoPago
    ) {

        this.validarTipoPago(
            tipoPago
        )

        const mesa =
            mesasService.validarMesa(
                mesaId
            )

        const usuarioEnMesa =
            mesa.usuarios.some(
                usuario =>
                    usuario.id ===
                    user.id
            )

        if (!usuarioEnMesa) {

            throw new ForbiddenError(
                'No perteneces a esta mesa'
            )

        }

        if (
            !mesa.pedidos ||
            !mesa.pedidos.length
        ) {

            throw new ValidationError(
                'La mesa no tiene pedidos pendientes'
            )

        }

        const pedidos =
            this.obtenerPedidosAPagar(
                mesa,
                user,
                tipoPago
            )

        const pedidosFacturados =
            pedidos.map(
                pedido => ({

                    ...pedido,

                    total:
                        Number(
                            pedido.precio
                        ) *
                        Number(
                            pedido.cantidad
                        ),

                })
            )

        const total =
            this.calcularTotal(
                pedidosFacturados
            )

        const factura =
            this.crearFactura(
                user,
                mesaId,
                tipoPago,
                pedidosFacturados,
                total
            )

        const facturas =
            facturasRepository.getAll()

        facturas.push(
            factura
        )

        facturasRepository.saveAll(
            facturas
        )

        this.eliminarPedidosPagados(
            mesa,
            pedidos,
            tipoPago
        )

        mesasRepository.update(
            mesa
        )

        return {

            message:
                'Pago realizado correctamente',

            factura,

            mesa,

        }

    },

    validarTipoPago(
        tipoPago
    ) {

        if (
            tipoPago !== 'individual' &&
            tipoPago !== 'mesa'
        ) {
            throw new ValidationError(
            'Tipo de pago inválido'
            )
        }

    },


    obtenerPedidosAPagar(
        mesa,
        user,
        tipoPago
    ) {

        let pedidos = []

        if (
            tipoPago === 'individual'
        ) {

            pedidos =
            mesa.pedidos.filter(
                pedido =>
                pedido.userId === user.id
            )

        } else {

            pedidos = [
            ...mesa.pedidos
            ]

        }

        if (!pedidos.length) {

            throw new ValidationError(

            tipoPago === 'individual'

                ? 'No tienes pedidos pendientes'

                : 'No hay pedidos pendientes'

            )

        }

        return pedidos

    },


    calcularTotal(
        pedidos
    ) {

        return pedidos.reduce(

            (
            total,
            pedido
            ) => {

            const precio =
                Number(
                pedido.precio
                )

            const cantidad =
                Number(
                pedido.cantidad
                )

            if (

                !Number.isFinite(
                precio
                ) ||

                precio < 0 ||

                !Number.isInteger(
                cantidad
                ) ||

                cantidad < 1

            ) {

                return total

            }

            return (
                total +
                precio * cantidad
            )

            },

            0

        )

    },


    crearFactura(
        user,
        mesaId,
        tipoPago,
        pedidos,
        total
    ) {

        return {

            id:
            Date.now(),

            user: {

            id:
                user.id,

            name:
                user.name,

            email:
                user.email,

            },

            mesaId,

            tipoPago,

            pedidos,

            total,

            estado:
            'pagada',

            createdAt:
            new Date()
                .toISOString(),

        }

    },

    eliminarPedidosPagados(
        mesa,
        pedidos,
        tipoPago
    ) {

        if (
            tipoPago === 'mesa'
        ) {

            mesa.pedidos = []

            return

        }

        const ids =
            new Set(

            pedidos.map(
                pedido =>
                pedido.id
            )

            )

        mesa.pedidos =
            mesa.pedidos.filter(

            pedido =>

                !ids.has(
                pedido.id
                )

            )

    },

}

export default facturasService