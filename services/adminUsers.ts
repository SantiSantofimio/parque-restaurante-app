export type AdminUser = {
  id: number | string
  name: string
  email: string
  role: string
  puntos: number
  createdAt: string | null
  active: boolean
}

function obtenerToken() {

  if (
    typeof window === 'undefined'
  ) {
    return null
  }

  return localStorage.getItem(
    'token'
  )
}


async function request(
  url: string,
  options: RequestInit = {}
) {

  const token =
    obtenerToken()

  const response =
    await fetch(
      url,
      {
        ...options,

        headers: {
          'Content-Type':
            'application/json',

          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {}),

          ...(options.headers || {}),
        },
      }
    )

  const data =
    await response.json()

  if (!response.ok) {

    throw new Error(
      data?.error ||
      'Error en la solicitud'
    )

  }

  return data
}


export async function obtenerUsuariosAdmin() {

  return request(
    'http://localhost:4000/api/admin/users'
  ) as Promise<AdminUser[]>

}


export async function cambiarRolUsuario(
  userId: number | string,
  role: string
) {

  return request(
    `http://localhost:4000/api/admin/users/${userId}/role`,
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

  return request(
    `http://localhost:4000/api/admin/users/${userId}/status`,
    {
      method: 'PATCH',

      body:
        JSON.stringify({
          active,
        }),
    }
  )

}