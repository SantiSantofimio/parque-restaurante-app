import type { Factura } from '@/types/facturas.ts'
import { getAuthHeaders } from './api'

const API_URL =
  'http://localhost:4000/api/facturas'

export async function obtenerFacturas(
    userId: number
) {

  const url = `${API_URL}?userId=${encodeURIComponent(
    String(userId)
  )}`

  const res = await fetch(url, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error(
      'Error obteniendo facturas'
    )
  }

  return res.json() as Promise<
    Factura[]
  >
}