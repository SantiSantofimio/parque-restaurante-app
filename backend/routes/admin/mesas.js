import express
  from 'express'

import authMiddleware
  from '../../middleware/authMiddleware.js'

import requirePermission
  from '../../middleware/requirePermission.js'

import asyncHandler
  from '../../utils/asyncHandler.js'

import {
  obtenerMesasAdmin,
  obtenerMesaAdmin,
} from '../../controllers/adminMesasController.js'

import {
  PERMISSIONS,
} from '../../config/permissions.js'


const router =
  express.Router()


router.use(
  authMiddleware
)


router.get(
  '/',
  requirePermission(
    PERMISSIONS.MANAGE_MESAS
  ),
  asyncHandler(
    obtenerMesasAdmin
  )
)


router.get(
  '/:mesaId',
  requirePermission(
    PERMISSIONS.MANAGE_MESAS
  ),
  asyncHandler(
    obtenerMesaAdmin
  )
)


export default router