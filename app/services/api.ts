const API_URL =
  'http://localhost:4000/api'


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


export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  const token =
    obtenerToken()

  const response =
    await fetch(
      `${API_URL}${endpoint}`,
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


  const contentType =
    response.headers.get(
      'content-type'
    )


  const data =
    contentType?.includes(
      'application/json'
    )
      ? await response.json()
      : null


  if (!response.ok) {

    throw new Error(
      data?.error ||
      'Error en la solicitud'
    )

  }


  return data as T

}


export async function login(
  email: string,
  password: string
) {

  return apiRequest(
    '/auth/login',
    {
      method: 'POST',

      body:
        JSON.stringify({
          email,
          password,
        }),
    }
  )

}


export async function register(
  name: string,
  email: string,
  password: string
) {

  return apiRequest(
    '/auth/register',
    {
      method: 'POST',

      body:
        JSON.stringify({
          name,
          email,
          password,
        }),
    }
  )

}


export function getAuthHeaders(
  token?: string
) {

  const authToken =
    token ??
    obtenerToken()

  return {
    'Content-Type':
      'application/json',

    ...(authToken
      ? {
          Authorization:
            `Bearer ${authToken}`,
        }
      : {}),
  }

}