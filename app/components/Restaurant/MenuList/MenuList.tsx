'use client'

import MenuCard from '../MenuCard/MenuCard'
import type { MenuItem } from '@/services/menu'

import styles from './MenuList.module.css'

interface Props {
  productos: MenuItem[]
  onAgregar: (producto: MenuItem) => void
}

export default function MenuList({
  productos,
  onAgregar,
}: Props) {
  if (!productos.length) {
    return (
      <p className={styles.empty}>
        No hay productos disponibles.
      </p>
    )
  }

  return (
    <div className={styles.grid}>
      {productos.map(producto => (
        <MenuCard
          key={producto.id}
          producto={producto.nombre}
          precio={producto.precio}
          imagen={producto.imagen}
          onAgregar={() =>
            onAgregar(producto)
          }
        />
      ))}
    </div>
  )
}