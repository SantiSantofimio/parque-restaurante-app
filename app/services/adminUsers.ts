import {
  apiRequest,
} from './api'


export type AdminUser = {

  id:
    number | string

  name:
    string

  email:
    string

  role:
    string

  puntos:
    number

  createdAt:
    string | null

  active:
    boolean

}


export async function obtenerUsuariosAdmin() {

  return apiRequest<AdminUser[]>(
    '/admin/users'
  )

}


export async function cambiarRolUsuario(
  userId: number | string,
  role: string
) {

  return apiRequest<{
    message: string
    user: AdminUser
  }>(
    `/admin/users/${userId}/role`,
    {
      method: 'PATCH',

      body:
        JSON.stringify({
          role,
        }),
    }
  )

}


export async function cambiarEstadoUsuario(
  userId: number | string,
  active: boolean
) {

  return apiRequest<{
    message: string
    user: AdminUser
  }>(
    `/admin/users/${userId}/status`,
    {
      method: 'PATCH',

      body:
        JSON.stringify({
          active,
        }),
    }
  )

}