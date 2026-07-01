'use client'

import styles from './PointsCard.module.css'

interface Props {
  puntos: number
}

export default function PointsCard({
  puntos,
}: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        ⭐
      </div>

      <div>
        <span className={styles.label}>
          Mis puntos
        </span>

        <h2>{puntos}</h2>

        <p>
          Sigue comprando para subir
          de nivel
        </p>
      </div>
    </div>
  )
}