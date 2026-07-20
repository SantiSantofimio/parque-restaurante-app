import type {
  Pedido,
} from './mesas'


export interface FacturaUsuario {

  id: number

  name: string

  email?: string

}


export interface Factura {

  id: number

  user:
    FacturaUsuario

  mesaId:
    string

  tipoPago?:
    'individual' |
    'mesa'

  pedidos:
    Pedido[]

  total:
    number

  estado?:
    'pagada'

  createdAt:
    string

}