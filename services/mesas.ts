import { Mesa, Usuario } from "@/types/mesas";
import { getAuthHeaders } from "./api";

const API_URL = 'http://localhost:4000/api/mesas'

export async function obtenerMesas(
  personas?: number
): Promise<Mesa[]> {
  const url = personas
    ? `${API_URL}?personas=${personas}`
    : API_URL

  const res = await fetch(url, {
    headers: getAuthHeaders(),
  })

  if (res.status === 401) {
    redirectToLogin()
    throw new Error('Sesión expirada')
  }

  if (!res.ok) {
    throw new Error(
      'Error al obtener mesas'
    )
  }

  return res.json() as Promise<Mesa[]>
}

export async function entrarAMesa(mesaId: string, user: Usuario): Promise<{ mesa: Mesa }> {
    const res = await fetch(`${API_URL}/${mesaId}/entrar`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ user })
    })

    if (res.status === 401) {
        redirectToLogin()
        throw new Error('Sesión expirada')
    }

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
    headers: getAuthHeaders(),
    body: JSON.stringify({ user }),
  })

  if (res.status === 401) {
    redirectToLogin()
    throw new Error('Sesión expirada')
  }

  if (!res.ok) {
    throw new Error('Error al salir de la mesa')
  }

  return res.json() as Promise<{ mesa: Mesa }>
}
function redirectToLogin() {
  // In a browser environment, navigate to the login page.
  // Guard for SSR where `window` is undefined.
  if (typeof window !== 'undefined') {
    const current = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.assign(`/login?next=${current}`);
    return;
  }

  // If not running in a browser, throw a clear error so callers can handle it.
  throw new Error('Not in a browser environment: cannot redirect to login');
}

