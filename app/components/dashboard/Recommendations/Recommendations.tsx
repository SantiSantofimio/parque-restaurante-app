'use client'

import styles from './Recommendations.module.css'
import { Recommendation } from '@/services/dashboard'

interface Props {
  recomendaciones: Recommendation[]
}

export default function Recommendations({
  recomendaciones,
}: Props) {
  if (!recomendaciones.length) return null

  return (
    <section className={styles.container}>
      <h2>✨ Recomendado para ti</h2>

      <div className={styles.list}>
        {recomendaciones.map(item => (
          <div
            key={item.id}
            className={styles.card}
          >
            <h3>{item.titulo}</h3>

            <p>{item.descripcion}</p>

            <button>
              Ver más
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}