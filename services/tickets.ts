import type { Ticket } from '@/types/tickets'

const API_URL = 'http://localhost:4000/api/tickets'

function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
  }
}

export async function obtenerTickets(): Promise<Ticket[]> {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  })

  if (!res.ok) {
    throw new Error('Error al obtener tickets')
  }

  return res.json()
}

export async function comprarTicket(
  tipo: 'adulto' | 'infantil',
  cantidad: number
): Promise<Ticket> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      tipo,
      cantidad,
    }),
  })

  if (!res.ok) {
    throw new Error('Error al comprar ticket')
  }

  return res.json()
}