import type { Ticket } from '@/types/tickets'

const API_URL = 'http://localhost:4000/api/tickets'

function getAuthHeaders() {
  const token = localStorage.getItem('token')

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

function handleUnauthorized() {
  localStorage.removeItem('token')
  window.location.href = '/auth/login'
}

export async function obtenerTickets(): Promise<Ticket[]> {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  })

  if (res.status === 401) {
    handleUnauthorized()
    throw new Error('Sesión expirada')
  }

  if (!res.ok) {
    throw new Error('Error al obtener tickets')
  }

  return res.json()
}

export async function comprarTicket(
  tipo: 'adulto' | 'infantil',
  cantidad: number
): Promise<Ticket> {
  const precio =
    tipo === 'adulto'
      ? 20000
      : 12000

  const res = await fetch(
    `${API_URL}/comprar`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        tipo,
        cantidad,
        precio,
      }),
    }
  )

  if (res.status === 401) {
    handleUnauthorized()
    throw new Error('Sesión expirada')
  }

  if (!res.ok) {
    throw new Error('Error al comprar ticket')
  }

  return res.json()
}