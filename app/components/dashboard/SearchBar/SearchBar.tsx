'use client'

import styles from './SearchBar.module.css'

export default function SearchBar() {
  return (
    <input
      type="search"
      placeholder="Buscar piscina, restaurante, recorridos..."
      aria-label="Buscar servicios"
      className={styles.search}
    />
  )
}