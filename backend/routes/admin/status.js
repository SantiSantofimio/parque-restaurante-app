import express from 'express'

import authMiddleware from '../../middleware/authMiddleware.js'

import requirePermission from '../../middleware/requirePermission.js'

import {
  PERMISSIONS,
} from '../../config/permissions.js'


const router = express.Router()

// ============================
// Estado del panel admin
// ============================

router.get(
  '/status',

  authMiddleware,

  requirePermission(
    PERMISSIONS.VIEW_ADMIN_DASHBOARD
  ),

  (req, res) => {
    return res.json({
      message:
        'Acceso administrativo autorizado',

      user: {
        id:
          req.user.id,

        name:
          req.user.name,

        email:
          req.user.email,

        role:
          req.user.role,
      },
    })
  }
)

export default router