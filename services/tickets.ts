import type { Ticket } from '@/types/tickets'
import {
  appPath,
} from '@/app/lib/paths'

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
  window.location.href = appPath('/auth/login/')
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
    const data = await res.json().catch(() => null)
    const message =
      data?.error ||
      data?.message ||
      'Error al comprar ticket'
    throw new Error(message)
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