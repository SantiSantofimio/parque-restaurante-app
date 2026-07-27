import express from 'express'
import fs from 'fs'
import path from 'path'
import {
  fileURLToPath,
} from 'url'

import authMiddleware from '../middleware/authMiddleware.js'

const __filename =
  fileURLToPath(
    import.meta.url
  )

const __dirname =
  path.dirname(
    __filename
  )

const router =
  express.Router()

router.use(
  authMiddleware
)


// ============================
// Archivos
// ============================

const FACTURAS_FILE =
  path.join(
    __dirname,
    '../data/facturas.json'
  )

const MESAS_FILE =
  path.join(
    __dirname,
    '../data/mesas.json'
  )


// ============================
// Helpers mesas
// ============================

function readMesas() {

  if (
    !fs.existsSync(
      MESAS_FILE
    )
  ) {
    return []
  }

  const raw =
    fs.readFileSync(
      MESAS_FILE,
      'utf-8'
    )

  if (
    !raw.trim()
  ) {
    return []
  }

  return JSON.parse(
    raw
  )
}


function writeMesas(
  mesas
) {

  fs.writeFileSync(
    MESAS_FILE,
    JSON.stringify(
      mesas,
      null,
      2
    )
  )

}


// ============================
// Helpers facturas
// ============================

function readFacturas() {

  if (
    !fs.existsSync(
      FACTURAS_FILE
    )
  ) {
    return []
  }

  const raw =
    fs.readFileSync(
      FACTURAS_FILE,
      'utf-8'
    )

  if (
    !raw.trim()
  ) {
    return []
  }

  return JSON.parse(
    raw
  )
}


function saveFacturas(
  facturas
) {

  fs.writeFileSync(
    FACTURAS_FILE,
    JSON.stringify(
      facturas,
      null,
      2
    )
  )

}


// ============================
// CREAR FACTURA / PAGAR
// ============================

router.post(
  '/',
  (req, res) => {

    const {
      mesaId,
      tipoPago,
    } = req.body

    const user =
      req.user


    // ==========================
    // Validaciones básicas
    // ==========================

    if (
      !user ||
      !mesaId ||
      !tipoPago
    ) {

      return res
        .status(400)
        .json({
          error:
            'Datos incompletos',
        })

    }


    if (
      tipoPago !==
        'individual' &&
      tipoPago !==
        'mesa'
    ) {

      return res
        .status(400)
        .json({
          error:
            'Tipo de pago inválido',
        })

    }


    // ==========================
    // Buscar mesa
    // ==========================

    const mesas =
      readMesas()

    const mesa =
      mesas.find(
        m =>
          m.id ===
          mesaId
      )


    if (
      !mesa
    ) {

      return res
        .status(404)
        .json({
          error:
            'Mesa no encontrada',
        })

    }


    // ==========================
    // Validar usuario en mesa
    // ==========================

    const usuarioEnMesa =
      mesa.usuarios?.some(
        usuario =>
          usuario.id ===
          user.id
      )


    if (
      !usuarioEnMesa
    ) {

      return res
        .status(403)
        .json({
          error:
            'No perteneces a esta mesa',
        })

    }


    // ==========================
    // Validar pedidos
    // ==========================

    if (
      !mesa.pedidos ||
      !mesa.pedidos.length
    ) {

      return res
        .status(400)
        .json({
          error:
            'La mesa no tiene pedidos pendientes',
        })

    }


    // ==========================
    // Determinar pedidos
    // a pagar
    // ==========================

    let pedidosAPagar = []


    if (
      tipoPago ===
      'individual'
    ) {

      pedidosAPagar =
        mesa.pedidos.filter(
          pedido =>
            pedido.userId ===
            user.id
        )

    }


    if (
      tipoPago ===
      'mesa'
    ) {

      pedidosAPagar = [
        ...mesa.pedidos,
      ]

    }


    // ==========================
    // Validar pedidos usuario
    // ==========================

    if (
      !pedidosAPagar.length
    ) {

      return res
        .status(400)
        .json({
          error:
            tipoPago ===
            'individual'
              ? 'No tienes pedidos pendientes'
              : 'No hay pedidos pendientes',
        })

    }

    // =================
    // Limpiar Factura
    //==================

    const pedidosFacturados = 
      pedidosAPagar.map(
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


    // ==========================
    // Calcular total
    // EN EL BACKEND
    // ==========================

    const total =
      pedidosFacturados.reduce(
        (
          acumulado,
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
            ) || cantidad < 1
          ) {
            return acumulado
          }
          return (
            acumulado + 
            precio * cantidad
          )
        },
        0
      )   


    // ==========================
    // Crear factura
    // ==========================

    const nuevaFactura = {

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

      pedidos:
        pedidosFacturados,

      total,

      estado:
        'pagada',

      createdAt:
        new Date()
          .toISOString(),

    }


    // ==========================
    // Guardar factura
    // ==========================

    const facturas =
      readFacturas()

    facturas.push(
      nuevaFactura
    )

    saveFacturas(
      facturas
    )


    // ==========================
    // Eliminar pedidos pagados
    // ==========================

    if (
      tipoPago ===
      'mesa'
    ) {

      mesa.pedidos = []

    } else {

      const idsPagados =
        new Set(
          pedidosAPagar.map(
            pedido =>
              pedido.id
          )
        )

      mesa.pedidos =
        mesa.pedidos.filter(
          pedido =>
            !idsPagados.has(
              pedido.id
            )
        )

    }


    // ==========================
    // Guardar mesa
    // ==========================

    writeMesas(
      mesas
    )


    // ==========================
    // Respuesta
    // ==========================

    return res.json({

      message:
        'Pago realizado correctamente',

      factura:
        nuevaFactura,

      mesa,

    })

  }
)


// ============================
// OBTENER MIS FACTURAS
// ============================

router.get(
  '/',
  (req, res) => {

    const facturas =
      readFacturas()


    // Solo devolvemos facturas
    // del usuario autenticado

    const facturasUsuario =
      facturas.filter(
        factura =>
          factura.user?.id ===
          req.user.id
      )


    res.json(
      facturasUsuario
    )

  }
)


export default router