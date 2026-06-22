'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './dashboard.module.css'
import { useAuth } from '@/app/hooks/useAuth'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <h1>Cargando...</h1>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        🌴 Parque Turístico Yuma
      </h1>

      <p className={styles.subtitle}>
        Bienvenido, {user?.name}
      </p>

      <div className={styles.grid}>
        <button
          onClick={() => router.push('/tickets')}
          className={styles.card}
        >
          🏊 Piscina y entradas
        </button>

        <button
          onClick={() => router.push('/mesas')}
          className={styles.card}
        >
          🍽 Restaurante
        </button>

        <button
          onClick={() => router.push('/bar')}
          className={styles.card}
        >
          🍹 Bar
        </button>

        <button
          onClick={() => router.push('/recorridos')}
          className={styles.card}
        >
          🚶 Recorridos turísticos
        </button>

        <button
          onClick={() => router.push('/puntos')}
          className={styles.card}
        >
          ⭐ Mis puntos
        </button>
      </div>
    </div>
  )
}