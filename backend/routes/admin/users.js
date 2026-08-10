import express
  from 'express'

import authMiddleware
  from '../../middleware/authMiddleware.js'

import requirePermission
  from '../../middleware/requirePermission.js'

import asyncHandler
  from '../../utils/asyncHandler.js'

import {
  obtenerUsuarios,
  cambiarRol,
} from '../../controllers/adminUsersController.js'

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
    PERMISSIONS.MANAGE_USERS
  ),

  asyncHandler(
    obtenerUsuarios
  )
)


router.patch(
  '/:userId/role',

  requirePermission(
    PERMISSIONS.CHANGE_USER_ROLE
  ),

  asyncHandler(
    cambiarRol
  )
)


export default router