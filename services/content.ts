import { getAuthHeaders } from './api'

const API_URL = 'http://localhost:4000/api/content'

export interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  actionText: string
  actionRoute: string
}

export interface Service {
  id: string
  title: string
  icon: string
  route: string
}

export interface Promotion {
  id: string
  title: string
  description: string
  image: string
}

export interface ContentData {
  banners: Banner[]
  services: Service[]
  promotions: Promotion[]
}

export async function obtenerContenido(): Promise<ContentData> {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  })

  if (res.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/auth/login'
    throw new Error('Sesión expirada')
  }

  if (!res.ok) {
    throw new Error('Error obteniendo contenido')
  }

  return res.json()
}