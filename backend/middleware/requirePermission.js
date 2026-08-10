import {
  ROLE_PERMISSIONS,
} from '../config/rolePermissions.js'

export default function requirePermission(
  permission
) {

  return (
    req,
    res,
    next
  ) => {

    const user =
      req.user

    if (!user) {

      return res
        .status(401)
        .json({
          error:
            'No autenticado',
        })

    }

    const permisos =
      ROLE_PERMISSIONS[
        user.role
      ] || []

    if (
      !permisos.includes(
        permission
      )
    ) {

      return res
        .status(403)
        .json({
          error:
            'No tienes permisos para realizar esta acción',
        })

    }

    next()

  }

}