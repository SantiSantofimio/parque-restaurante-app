import authService
  from '../services/authService.js'

export async function registrarUsuario(
  req,
  res
) {

  const resultado =
    await authService.registrarUsuario(
      req.body
    )

  return res
    .status(201)
    .json(
      resultado
    )

}

export async function login(
  req,
  res
) {

  const resultado =
    await authService.login(
      req.body
    )

  return res.json(
    resultado
  )

}