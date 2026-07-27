import { getAuthHeaders } from './api'
import {
  appPath,
} from '@/app/lib/paths'

const API_URL = 'http://localhost:4000/api/content'

export interface Banner {
  id: string
  title: string
  subtitle: string
  button: string
  route: string
  emoji: string
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

export interface News {
  id: string
  title: string
  description: string
  image: string
}

export interface Event {
  id: string
  title: string
  date: string
  image: string
}

export interface ContentData {
  banners: Banner[]
  services: Service[]
  promotions: Promotion[]
  news: News[]
  events: Event[]
}

export async function obtenerContenido(): Promise<ContentData> {
  const res = await fetch(API_URL, {
    headers: getAuthHeaders(),
  })

  if (res.status === 401) {
    localStorage.removeItem('token')
    window.location.href = appPath('/auth/login')
    throw new Error('Sesión expirada')
  }

  if (!res.ok) {
    throw new Error('Error obteniendo contenido')
  }

  return res.json()
}