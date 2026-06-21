export interface Ticket {
  id: string
  userId: number
  tipo: 'adulto' | 'infantil'
  cantidad: number
  precioUnitario: number
  total: number
  estado: 'activo' | 'usado' | 'cancelado'
  fechaCompra: string
  codigoQR: string
}