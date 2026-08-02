import express from 'express'
import requireRole from '../../middleware/requireRole.js'
import authMiddleware from '../../middleware/authMiddleware.js'

const router = express.Router()

// ============================
// Dashboard administrativo
// ============================

router.get(
  '/dashboard',

  authMiddleware,

  requireRole(
    'admin'
  ),

  (req, res) => {

    try {

      const mesas =
        readJsonFile(
          MESAS_FILE
        )

      const users =
        readJsonFile(
          USERS_FILE
        )

      const facturas =
        readJsonFile(
          FACTURAS_FILE
        )

      // ========================
      // Mesas
      // ========================

      const totalMesas =
        mesas.length

      const mesasOcupadas =
        mesas.filter(
          mesa =>
            Array.isArray(
              mesa.usuarios
            ) &&
            mesa.usuarios.length > 0
        ).length

      const mesasDisponibles =
        totalMesas -
        mesasOcupadas

      // ========================
      // Pedidos
      // ========================

      const pedidosActivos =
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

      const valorPedidosActivos =
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

      // ========================
      // Clientes
      // ========================

      const clientes =
        users.filter(
          user =>
            (
              user.role ||
              'customer'
            ) ===
            'customer'
        ).length

      // ========================
      // Facturación
      // ========================

      const facturasPagadas =
        facturas.filter(
          factura =>
            !factura.estado ||
            factura.estado ===
              'pagada'
        )

      const ingresosTotales =
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

      // ========================
      // Respuesta
      // ========================

      return res.json({

        mesas: {
          total:
            totalMesas,

          ocupadas:
            mesasOcupadas,

          disponibles:
            mesasDisponibles,
        },

        pedidos: {
          activos:
            pedidosActivos,

          valorActivo:
            valorPedidosActivos,
        },

        clientes: {
          total:
            clientes,
        },

        facturacion: {
          facturas:
            facturasPagadas.length,

          ingresos:
            ingresosTotales,
        },

        generatedAt:
          new Date()
            .toISOString(),

      })

    } catch (error) {

      console.error(
        'Error dashboard admin:',
        error
      )

      return res
        .status(500)
        .json({
          error:
            'No se pudieron obtener las métricas administrativas',
        })

    }

  }
)

export default router