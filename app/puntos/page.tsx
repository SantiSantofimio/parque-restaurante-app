'use client'

import { useEffect, useState } from 'react'
import styles from './puntos.module.css'

export default function PuntosPage() {
  const [puntos] = useState<number>(() => {
    if (typeof window === 'undefined') return 0

    const user = window.localStorage.getItem('user')
    if (!user) return 0

    try {
      const parsedUser = JSON.parse(user)
      return parsedUser.puntos ?? 0
    } catch {
      return 0
    }
  })

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>⭐ Mis puntos</h1>

        <div className={styles.points}>
          {puntos}
        </div>

        <p>Puntos acumulados</p>

        <div className={styles.rewards}>
          <h2>Beneficios</h2>

          <ul>
            <li>100 puntos → Entrada infantil gratis</li>
            <li>200 puntos → 10% de descuento</li>
            <li>500 puntos → Entrada adulto gratis</li>
          </ul>
        </div>
      </div>
    </div>
  )
}