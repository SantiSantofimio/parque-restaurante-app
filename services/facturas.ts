import type { Factura } from '@/types/facturas.ts'

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
        headers: {
          'x-user-id':
            String(userId),
          'x-user-name':
            userName,
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