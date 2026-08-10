import express from 'express'

import requirePermission from '../../middleware/requirePermission.js'

import { PERMISSIONS } from '../../config/permissions.js'

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

  requirePermission(
    PERMISSIONS.VIEW_ADMIN_DASHBOARD
  ),

  asyncHandler(obtenerDashboardAdmin
  )
)

export default router