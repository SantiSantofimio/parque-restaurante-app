import type {
  Pedido,
  Usuario,
} from '@/types/mesas'

export interface Factura {
  id: number
  user: Usuario
  mesaId: string
  pedidos: Pedido[]
  total: number
  createdAt: string
}