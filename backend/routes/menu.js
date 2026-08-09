import express from 'express'

import authMiddleware from '../middleware/authMiddleware.js'

import asyncHandler from '../utils/asyncHandler.js'

import { obtenerMenu } from '../controllers/menuController.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', asyncHandler(obtenerMenu))

export default router