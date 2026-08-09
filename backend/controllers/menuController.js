import menuService
  from '../services/menuService.js'

export function obtenerMenu(
  req,
  res
) {

  const menu =
    menuService.obtenerMenu()

  return res.json(
    menu
  )

}