import express from 'express'
import requireRole from '../../middleware/requireRole.js'
import authMiddleware from '../../middleware/authMiddleware.js'

import asyncHandler from '../../utils/asyncHandler.js'
import { obtenerDashboardAdmin } from '../../controllers/adminDashboardController.js'

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

  asyncHandler(obtenerDashboardAdmin
  )
)

export default router