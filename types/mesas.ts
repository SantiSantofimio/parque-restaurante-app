export interface Usuario {
  id: number
  name: string
}

// ============================
// Pedido guardado en la mesa
// ============================

export interface Pedido {
  id: number
  productoId?: string
  producto: string
  precio: number
  cantidad: number
  total: number
  observaciones?: string
  userId?: number
}

// ============================
// Mesa
// ============================

export interface Mesa {
  id: string
  capacidad: number
  ocupada: boolean
  usuarios: Usuario[]
  pedidos: Pedido[]
}

// ============================
// Producto enviado al backend
// desde el carrito
// ============================

export interface PedidoInput {
  productoId: string
  cantidad: number
  observaciones?: string
}