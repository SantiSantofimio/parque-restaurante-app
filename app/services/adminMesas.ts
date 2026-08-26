import {
  apiRequest,
} from './api'


export type AdminMesaUsuario = {
  id: number | string
  name: string
}


export type AdminMesa = {
  id: string
  capacidad: number
  ocupada: boolean
  usuarios: AdminMesaUsuario[]
  pedidos: unknown[]
  ocupacion: number
  consumo: number
}


export type AdminMesasResumen = {
  total: number
  ocupadas: number
  disponibles: number
  pedidosActivos: number
  consumoActivo: number
}


export type AdminMesasResponse = {
  mesas: AdminMesa[]
  resumen: AdminMesasResumen
}


export async function obtenerMesasAdmin() {

  return apiRequest<AdminMesasResponse>(
    '/admin/mesas'
  )

}