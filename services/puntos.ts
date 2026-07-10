import { getAuthHeaders } from './api'

const API_URL = 'http://localhost:4000/api/puntos'

export interface MovimientoPuntos {
  id: string
  puntos: number
  descripcion: string
  fecha: string
}

export interface PuntosResponse {
  puntos: number
  historial: MovimientoPuntos[]
}

export async function obtenerPuntos(): Promise<PuntosResponse> {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error('Error obteniendo puntos')
  }

  return res.json()
}