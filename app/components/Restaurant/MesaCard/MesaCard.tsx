'use client'

import styles from './MesaCard.module.css'

interface Props {
  id: string
  capacidad: number
  ocupada: boolean
  onEntrar: () => void
}

export default function MesaCard({
  id,
  capacidad,
  ocupada,
  onEntrar,
}: Props) {
  return (
    <div className={styles.card}>

      <div className={styles.icon}>
        🍽
      </div>

      <h2>{id}</h2>

      <p>

        👥 {capacidad} personas

      </p>

      <span
        className={
          ocupada
            ? styles.busy
            : styles.free
        }
      >
        {ocupada
          ? 'Ocupada'
          : 'Disponible'}
      </span>

      <button
        disabled={ocupada}
        onClick={onEntrar}
      >
        Entrar
      </button>

    </div>
  )
}