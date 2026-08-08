import mesasRepository
  from '../repositories/mesasRepository.js'

import usersRepository
  from '../repositories/usersRepository.js'

import facturasRepository
  from '../repositories/facturasRepository.js'

const adminDashboardService = {

    obtenerDashboard() {

        const mesas =
        mesasRepository.getAll()

        const users =
        usersRepository.getAll()

        const facturas =
        facturasRepository.getAll()

        return {

        mesas:
            this.obtenerMetricasMesas(
            mesas
            ),

        pedidos:
            this.obtenerMetricasPedidos(
            mesas
            ),

        clientes:
            this.obtenerMetricasClientes(
            users
            ),

        facturacion:
            this.obtenerMetricasFacturacion(
            facturas
            ),

        generatedAt:
            new Date()
            .toISOString(),

        }

    },

    obtenerMetricasMesas(
        mesas
    ) {

        const total =
            mesas.length

        const ocupadas =
            mesas.filter(
                mesa =>
                    Array.isArray(
                        mesa.usuarios
                    ) &&
                    mesa.usuarios.length > 0
            ).length

        return {

            total,

            ocupadas,

            disponibles:
                total - ocupadas,

        }

    },

    obtenerMetricasPedidos(
        mesas
    ) {

        const activos =
            mesas.reduce(

                (
                    total,
                    mesa
                ) =>

                    total +

                    (
                        Array.isArray(
                            mesa.pedidos
                        )

                            ? mesa.pedidos.length

                            : 0
                    ),

                0

            )

        const valorActivo =
            mesas.reduce(

                (
                    total,
                    mesa
                ) => {

                    if (
                        !Array.isArray(
                            mesa.pedidos
                        )
                    ) {

                        return total

                    }

                    return (

                        total +

                        mesa.pedidos.reduce(

                            (
                                subtotal,
                                pedido
                            ) =>

                                subtotal +

                                Number(
                                    pedido.total ||
                                    0
                                ),

                            0

                        )

                    )

                },

                0

            )

        return {

            activos,

            valorActivo,

        }

    },

    obtenerMetricasClientes(
        users
    ) {

        return {

            total:

                users.filter(

                    user =>

                        (
                            user.role ||
                            'customer'
                        ) ===
                        'customer'

                ).length,

        }

    },

    obtenerMetricasFacturacion(
        facturas
    ) {

        const facturasPagadas =
            facturas.filter(

                factura =>

                    !factura.estado ||

                    factura.estado ===
                    'pagada'

            )

        const ingresos =
            facturasPagadas.reduce(

                (
                    total,
                    factura
                ) =>

                    total +

                    Number(
                        factura.total ||
                        0
                    ),

                0

            )

        return {

            facturas:
                facturasPagadas.length,

            ingresos,

        }

    },

}

export default adminDashboardService