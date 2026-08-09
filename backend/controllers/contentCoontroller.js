import contentService
  from '../services/contentService.js'

export function obtenerContenido(
  req,
  res
) {

  const contenido =
    contentService.obtenerContenido()

  return res.json(
    contenido
  )

}