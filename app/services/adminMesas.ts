import {
  apiRequest,
} from './api'


export type AdminMesaUsuario = {
  id: number | string
  name: string
}


export type AdminMesaPedido = {
  id: number | string
  userId: number | string
  userName: string
  productoId: string
  producto: string
  precio: number
  cantidad: number
  total: number
  observaciones: string
}


export type AdminMesa = {
  id: string
  capacidad: number
  ocupada: boolean
  usuarios: AdminMesaUsuario[]
  pedidos: AdminMesaPedido[]
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


export async function obtenerMesaAdmin(
  mesaId: string
) {

  return apiRequest<AdminMesa>(
    `/admin/mesas/${mesaId}`
  )

}