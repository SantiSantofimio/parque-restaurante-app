import express from 'express'

import authMiddleware from '../middleware/authMiddleware.js'

import facturasService from '../services/facturasService.js'


const router =
  express.Router()

router.use(
  authMiddleware
)

// ============================
// CREAR FACTURA / PAGAR
// ============================

router.post(
  '/',
  (req, res) => {

    const resultado =
      facturasService.pagarPedidos(
        req.user,
        req.body.mesaId,
        req.body.tipoPago
      )

      return res.json(
        resultado
      )

  }
)


// ============================
// OBTENER MIS FACTURAS
// ============================

router.get(
  '/',
  (req, res) => {

    const facturas =
      facturasService.obtenerFacturasUsuario(
        req.user.id
      )

    // Solo devolvemos facturas
    // del usuario autenticado

    res.json(
      facturas
    )

  }
)


export default router