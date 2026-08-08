import express from 'express'

import authMiddleware from '../middleware/authMiddleware.js'

import asyncHandler from '../utils/asyncHandler.js'

import { obtenerDashboard } from '../controllers/dashboardController.js'

const router = express.Router()

router.use(authMiddleware)


router.get('/', 
  asyncHandler(obtenerDashboard)
)


export default router