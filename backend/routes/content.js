import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'

import asynchHandler from '../utils/asyncHandler.js'
import { obtenerContenido } from '../controllers/contentCoontroller.js'


const router = express.Router()

router.use(authMiddleware)


router.get('/', asynchHandler(obtenerContenido))

export default router