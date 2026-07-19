'use client'

import styles from './CategoryTabs.module.css'

interface Props {
  categorias: string[]
  categoriaActiva: string
  onSeleccionar: (categoria: string) => void
}

export default function CategoryTabs({
  categorias,
  categoriaActiva,
  onSeleccionar,
}: Props) {
  return (
    <div className={styles.container}>
      {categorias.map(categoria => (
        <button
          key={categoria}
          onClick={() => onSeleccionar(categoria)}
          className={
            categoria === categoriaActiva
              ? styles.active
              : ''
          }
        >
          {categoria}
        </button>
      ))}
    </div>
  )
}