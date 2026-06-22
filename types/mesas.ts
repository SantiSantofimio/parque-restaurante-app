export interface Usuario {
  id: number
  name: string
}

export interface Pedido {
  id: number
  producto: string
  precio: number
  cantidad: number
  total: number
}

export interface Mesa {
  id: string
  capacidad: number
  ocupada: boolean
  usuarios: Usuario[]
  pedidos: Pedido[]
}