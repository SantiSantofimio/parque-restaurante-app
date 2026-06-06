import type { Factura } from '@/types/facturas.ts'

const API_URL =
  'http://localhost:4000/api/facturas'

export async function obtenerFacturas() {
  const token =
    localStorage.getItem(
      'token'
    )

  const res =
    await fetch(
      API_URL,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
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