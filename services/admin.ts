import {
  getAuthHeaders,
} from './api'

import {
  redirectToLogin,
} from '@/app/lib/auth'

const API_URL =
  'http://localhost:4000/api/admin'

export interface AdminUser {
  id: number
  name: string
  email: string
  role: string
}

export interface AdminStatusResponse {
  message: string
  user: AdminUser
}

export interface AdminDashboardResponse {
  mesas: {
    total: number
    ocupadas: number
    disponibles: number
  }

  pedidos: {
    activos: number
    valorActivo: number
  }

  clientes: {
    total: number
  }

  facturacion: {
    facturas: number
    ingresos: number
  }

  generatedAt: string
}

export class AdminAccessError extends Error {
  status: number

  constructor(
    message: string,
    status: number
  ) {
    super(message)

    this.name =
      'AdminAccessError'

    this.status =
      status
  }
}

export async function obtenerAdminDashboard():
Promise<AdminDashboardResponse> {

  const res =
    await fetch(
      `${API_URL}/dashboard`,
      {
        headers:
          getAuthHeaders(),
      }
    )

  if (
    res.status === 401
  ) {
    redirectToLogin()

    throw new AdminAccessError(
      'Sesión expirada',
      401
    )
  }

  if (
    res.status === 403
  ) {
    throw new AdminAccessError(
      'No tienes permisos de administrador',
      403
    )
  }

  if (
    !res.ok
  ) {

    const data =
      await res
        .json()
        .catch(
          () => null
        )

    throw new AdminAccessError(
      data?.error ||
        'No se pudo cargar el dashboard administrativo',
      res.status
    )
  }

  return res.json()
}

export async function obtenerAdminStatus():
Promise<AdminStatusResponse> {

  const res =
    await fetch(
      `${API_URL}/status`,
      {
        headers:
          getAuthHeaders(),
      }
    )

  if (
    res.status === 401
  ) {
    redirectToLogin()

    throw new AdminAccessError(
      'Sesión expirada',
      401
    )
  }

  if (
    res.status === 403
  ) {
    throw new AdminAccessError(
      'No tienes permisos de administrador',
      403
    )
  }

  if (
    !res.ok
  ) {
    const data =
      await res
        .json()
        .catch(
          () => null
        )

    throw new AdminAccessError(
      data?.error ||
        'No se pudo validar el acceso administrativo',
      res.status
    )
  }

  return res.json()

}