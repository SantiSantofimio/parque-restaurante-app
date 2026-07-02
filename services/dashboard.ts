import { getAuthHeaders } from './api'

const API_URL = 'http://localhost:4000/api/dashboard'

export interface DashboardData {
  name: string
  puntos: number
  tickets: number
}

export async function obtenerDashboard(): Promise<DashboardData> {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  })

  if (res.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/auth/login'
    throw new Error('Sesión expirada')
  }

  if (!res.ok) {
    throw new Error('Error obteniendo dashboard')
  }

  return res.json()
}