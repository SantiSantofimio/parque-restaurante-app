import express from 'express'

import authMiddleware from '../middleware/authMiddleware.js'

import asyncHandler from '../utils/asyncHandler.js'

import { obtenerTickets, comprarTicket } from '../controllers/ticketsController.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', asyncHandler(obtenerTickets))


router.post('/comprar', asyncHandler(comprarTicket))


export default router