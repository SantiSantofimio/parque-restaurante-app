import express from 'express'

import authMiddleware from '../middleware/authMiddleware.js'

import asyncHandler from '../utils/asyncHandler.js'

import {
  pagarPedidos,
  obtenerFacturas
} from '../controllers/facturasController.js'


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
asyncHandler(
  pagarPedidos
  )
)


// ============================
// OBTENER MIS FACTURAS
// ============================

router.get(
  '/',
  asyncHandler(
    obtenerFacturas
  )
)


export default router