import { Mesa, Usuario } from "@/types/mesas";

const API_URL = 'http://localhost:4000/api/mesas'

export async function obtenerMesas(personas?: number): Promise<Mesa[]> {
    const url = personas ? `${API_URL}?personas=${personas}` : API_URL
    const res = await fetch(url)
    if (!res.ok) {
        throw new Error('Error al obtener mesas')
    }
    return res.json() as Promise<Mesa[]>
}

export async function entrarAMesa(mesaId: string, user: Usuario): Promise<{ mesa: Mesa }> {
    const res = await fetch(`${API_URL}/${mesaId}/entrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user })
    })
    if (!res.ok) {
        throw new Error('Error al entrar a la mesa')
    }
    return res.json() as Promise<{ mesa: Mesa }>
}

export async function salirDeMesa(
  mesaId: string,
  user: Usuario
): Promise<{ mesa: Mesa }> {
  const res = await fetch(`${API_URL}/${mesaId}/salir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user }),
  })

  if (!res.ok) {
    throw new Error('Error al salir de la mesa')
  }

  return res.json()
}
