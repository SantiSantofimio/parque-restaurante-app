'use client'

import type { Mesa } from '@/types/mesas'
import styles from './MesaCard.module.css'

interface Props {
  mesa: Mesa
}

export default function MesaCard({
  mesa
}: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>{mesa.id}</h2>

        <span
          className={
            mesa.ocupada
              ? styles.ocupada
              : styles.libre
          }
        >
          {mesa.ocupada
            ? 'Ocupada'
            : 'Libre'}
        </span>
      </div>

      <div className={styles.info}>
        <p>
          👥 {mesa.usuarios.length}/
          {mesa.capacidad} personas
        </p>

        <p>
          🍽 {mesa.pedidos?.length ?? 0} pedidos
        </p>
      </div>

      <div className={styles.users}>
        {mesa.usuarios.map(usuario => (
          <div
            key={usuario.id}
            className={styles.user}
          >
            👤 {usuario.name}
          </div>
        ))}
      </div>
    </div>
  )
}