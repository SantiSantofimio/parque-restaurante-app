'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { MenuItem } from '@/app/services/menu'

import type {
  ProductSelection,
} from '@/app/components/Restaurant/ProductModal/ProductModal'

// ============================
// Item almacenado en carrito
// ============================

export interface CartItem {
  id: string
  producto: MenuItem
  cantidad: number
  observaciones: string
}

// ============================
// Tipo del Context
// ============================

interface CartContextType {
  items: CartItem[]

  agregarProducto: (
    seleccion: ProductSelection
  ) => void

  aumentarCantidad: (
    itemId: string
  ) => void

  disminuirCantidad: (
    itemId: string
  ) => void

  eliminarProducto: (
    itemId: string
  ) => void

  vaciarCarrito: () => void

  totalProductos: number

  totalPrecio: number
}

// ============================
// Crear Context
// ============================

const CartContext =
  createContext<
    CartContextType | undefined
  >(undefined)

// ============================
// Props del Provider
// ============================

interface CartProviderProps {
  children: ReactNode
}

// ============================
// Provider
// ============================

export function CartProvider({
  children,
}: CartProviderProps) {
  const [items, setItems] =
    useState<CartItem[]>([])

  // ============================
  // Agregar producto
  // ============================

  function agregarProducto(
    seleccion: ProductSelection
  ) {
    const {
      producto,
      cantidad,
      observaciones,
    } = seleccion

    setItems(prev => {
      // Buscamos si ya existe el mismo
      // producto con las mismas
      // observaciones.

      const existente =
        prev.find(
          item =>
            item.producto.id ===
              producto.id &&
            item.observaciones ===
              observaciones
        )

      // Si existe, sumamos cantidad.

      if (existente) {
        return prev.map(item =>
          item.id === existente.id
            ? {
                ...item,
                cantidad:
                  item.cantidad +
                  cantidad,
              }
            : item
        )
      }

      // Si no existe, creamos
      // una nueva línea del carrito.

      const nuevoItem: CartItem = {
        id: crypto.randomUUID(),
        producto,
        cantidad,
        observaciones,
      }

      return [
        ...prev,
        nuevoItem,
      ]
    })
  }

  // ============================
  // Aumentar cantidad
  // ============================

  function aumentarCantidad(
    itemId: string
  ) {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              cantidad:
                item.cantidad + 1,
            }
          : item
      )
    )
  }

  // ============================
  // Disminuir cantidad
  // ============================

  function disminuirCantidad(
    itemId: string
  ) {
    setItems(prev =>
      prev
        .map(item =>
          item.id === itemId
            ? {
                ...item,
                cantidad:
                  item.cantidad - 1,
              }
            : item
        )
        .filter(
          item =>
            item.cantidad > 0
        )
    )
  }

  // ============================
  // Eliminar producto
  // ============================

  function eliminarProducto(
    itemId: string
  ) {
    setItems(prev =>
      prev.filter(
        item =>
          item.id !== itemId
      )
    )
  }

  // ============================
  // Vaciar carrito
  // ============================

  function vaciarCarrito() {
    setItems([])
  }

  // ============================
  // Número total de unidades
  // ============================

  const totalProductos =
    useMemo(() => {
      return items.reduce(
        (total, item) =>
          total + item.cantidad,
        0
      )
    }, [items])

  // ============================
  // Precio total
  // ============================

  const totalPrecio =
    useMemo(() => {
      return items.reduce(
        (total, item) =>
          total +
          item.producto.precio *
            item.cantidad,
        0
      )
    }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        agregarProducto,
        aumentarCantidad,
        disminuirCantidad,
        eliminarProducto,
        vaciarCarrito,
        totalProductos,
        totalPrecio,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ============================
// Hook personalizado
// ============================

export function useCart() {
  const context =
    useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart debe utilizarse dentro de CartProvider'
    )
  }

  return context
}