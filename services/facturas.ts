import type { Factura } from '@/types/facturas.ts'
import { getAuthHeaders } from './api'

const API_URL =
  'http://localhost:4000/api/facturas'

export async function obtenerFacturas(
    userId: number,
    userName: string
) {

  const res =
    await fetch(
      API_URL,
      {
        headers: 
          getAuthHeaders()
      }
    )

  if (!res.ok) {
    throw new Error(
      'Error obteniendo facturas'
    )
  }

  return res.json() as Promise<
    Factura[]
  >
}