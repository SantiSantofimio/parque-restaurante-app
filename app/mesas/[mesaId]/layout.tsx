'use client'

import type {
  ReactNode,
} from 'react'

import {
  CartProvider,
} from '@/app/components/Restaurant/CartContext/CartContext'

interface Props {
  children: ReactNode
}

export default function MesaLayout({
  children,
}: Props) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}