export interface Usuario {
  id: number
  name: string
}

export interface PedidoInput {
  producto: string
  precio: number
  cantidad: number
  observaciones?: string
}

export interface Pedido {
  id: number

  userId: number
  userName: string

  producto: string
  precio: number
  cantidad: number
  total: number

  observaciones?: string
  createdAt?: string
}

export interface Mesa {
  id: string
  capacidad: number
  ocupada: boolean
  usuarios: Usuario[]
  pedidos: Pedido[]
}