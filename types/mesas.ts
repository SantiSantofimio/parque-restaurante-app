export interface Usuario {
  id: number
  name: string
}

export interface Pedido {
  id: number

  // Usuario que realizó el pedido
  userId: number

  productoId?: string

  producto: string
  precio: number
  cantidad: number
  total: number

  observaciones?: string
}

export interface PedidoInput {
  productoId: string
  cantidad: number
  observaciones?: string
}

export interface Mesa {
  id: string
  capacidad: number
  ocupada: boolean
  usuarios: Usuario[]
  pedidos: Pedido[]
}