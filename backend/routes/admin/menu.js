import express
  from 'express'


import authMiddleware
  from '../../middleware/authMiddleware.js'


import requirePermission
  from '../../middleware/requirePermission.js'


import asyncHandler
  from '../../utils/asyncHandler.js'


import {

  obtenerMenuAdmin,

  crearProductoAdmin,

  actualizarProductoAdmin,

  cambiarDisponibilidadAdmin,

} from '../../controllers/adminMenuController.js'


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
    PERMISSIONS.MANAGE_MENU
  ),
  asyncHandler(
    obtenerMenuAdmin
  )
)


router.post(
  '/',
  requirePermission(
    PERMISSIONS.MANAGE_MENU
  ),
  asyncHandler(
    crearProductoAdmin
  )
)

router.patch(
  '/:productId',
  requirePermission(
    PERMISSIONS.MANAGE_MENU
  ),
  asyncHandler(
    actualizarProductoAdmin
  )
)

router.patch(
  '/:productId/status',
  requirePermission(
    PERMISSIONS.MANAGE_MENU
  ),
  asyncHandler(
    cambiarDisponibilidadAdmin
  )
)


export default router