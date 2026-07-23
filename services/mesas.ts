import type {
  Mesa,
  PedidoInput,
} from '@/types/mesas'

import {
  getAuthHeaders,
} from './api'

const API_URL =
  'http://localhost:4000/api/mesas'

// ============================
// Redirección login
// ============================

function redirectToLogin() {
  if (
    typeof window !==
    'undefined'
  ) {
    localStorage.removeItem(
      'token'
    )

    window.location.href =
      '/auth/login'
  }
}

// ============================
// Manejo de errores
// ============================

async function getErrorMessage(
  res: Response
) {
  const data =
    await res
      .json()
      .catch(() => null)

  return (
    data?.error ||
    data?.message ||
    'Error en la solicitud'
  )
}

// ============================
// Obtener una mesa
// ============================

export async function obtenerMesa(
  mesaId: string
): Promise<Mesa> {

  const res = await fetch(
    `${API_URL}/${mesaId}`,
    {
      headers:
        getAuthHeaders(),
    }
  )

  if (res.status === 401) {
    redirectToLogin()

    throw new Error(
      'Sesión expirada'
    )
  }

  if (!res.ok) {
    throw new Error(
      await getErrorMessage(res)
    )
  }

  return res.json()
}

// ============================
// Obtener todas las mesas
// ============================

export async function obtenerMesas():
Promise<Mesa[]> {

  const res = await fetch(
    API_URL,
    {
      headers:
        getAuthHeaders(),
    }
  )

  if (res.status === 401) {
    redirectToLogin()

    throw new Error(
      'Sesión expirada'
    )
  }

  if (!res.ok) {
    throw new Error(
      await getErrorMessage(res)
    )
  }

  return res.json()
}

// ============================
// Entrar a mesa
// ============================

export async function entrarAMesa(
  mesaId: string
): Promise<{
  mesa: Mesa
  message: string
}> {
  const res = await fetch(
    `${API_URL}/${mesaId}/entrar`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
    }
  )

  if (res.status === 401) {
    redirectToLogin()

    throw new Error(
      'Sesión expirada'
    )
  }

  if (!res.ok) {
    const data = await res
      .json()
      .catch(() => null)

    throw new Error(
      data?.error ||
      'Error al entrar a la mesa'
    )
  }

  return res.json()
}

// ============================
// Salir de mesa
// ============================

export async function salirDeMesa(
  mesaId: string
): Promise<{
  mesa: Mesa
  message: string
}> {

  const res =
    await fetch(
      `${API_URL}/${mesaId}/salir`,
      {

        method:
          'POST',

        headers:
          getAuthHeaders(),

      }
    )


  if (
    res.status === 401
  ) {

    redirectToLogin()

    throw new Error(
      'Sesión expirada'
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


    throw new Error(

      data?.error ||

      'Error al salir de la mesa'

    )

  }


  return res.json()

}

// ============================
// Confirmar carrito como pedido
// ============================

export async function confirmarPedido(
  mesaId: string,
  productos: PedidoInput[]
): Promise<{
  message: string
  mesa: Mesa
}> {

  const res = await fetch(
    `${API_URL}/${mesaId}/pedidos`,
    {
      method: 'POST',

      headers:
        getAuthHeaders(),

      body:
        JSON.stringify({
          productos,
        }),
    }
  )

  if (res.status === 401) {
    redirectToLogin()

    throw new Error(
      'Sesión expirada'
    )
  }

  if (!res.ok) {
    throw new Error(
      await getErrorMessage(res)
    )
  }

  return res.json()
}