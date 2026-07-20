import type {
  Factura,
} from '@/types/facturas'

import type {
  Mesa,
} from '@/types/mesas'

import {
  getAuthHeaders,
} from './api'

import {
  redirectToLogin,
} from '@/app/lib/auth'


const API_URL =
  'http://localhost:4000/api/facturas'


export type TipoPago =
  | 'individual'
  | 'mesa'


export interface PagoResponse {

  message: string

  factura:
    Factura

  mesa:
    Mesa

}


// ============================
// Obtener mis facturas
// ============================

export async function obtenerFacturas():
Promise<Factura[]> {

  const res =
    await fetch(
      API_URL,
      {
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

    throw new Error(
      'Error obteniendo facturas'
    )

  }


  return res.json()

}


// ============================
// Pagar pedidos
// ============================

export async function pagarPedidos(

  mesaId: string,

  tipoPago:
    TipoPago

): Promise<PagoResponse> {

  const res =
    await fetch(
      API_URL,
      {

        method:
          'POST',

        headers:
          getAuthHeaders(),

        body:
          JSON.stringify({

            mesaId,

            tipoPago,

          }),

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

      'No se pudo realizar el pago'

    )

  }


  return res.json()

}