import express from 'express'

import authMiddleware from '../middleware/authMiddleware.js'
import asyncHandler from '..utils/asyncHandler.js'
import { obtenerPuntos } from '../controllers/pointsController.js'

const router = express.Router()

router.use(authMiddleware)


router.get('/', asyncHandler(obtenerPuntos))

export default router