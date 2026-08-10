import adminUsersService
  from '../services/adminUsersService.js'


export function obtenerUsuarios(
  req,
  res
) {

  const usuarios =
    adminUsersService.obtenerUsuarios()

  return res.json(
    usuarios
  )

}


export function cambiarRol(
  req,
  res
) {

  const usuario =
    adminUsersService.cambiarRol(
      req.user,
      req.params.userId,
      req.body.role
    )

  return res.json({

    message:
      'Rol actualizado correctamente',

    user:
      usuario,

  })

}