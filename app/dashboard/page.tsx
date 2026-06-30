'use client'

import { 
  useEffect, 
  useState 
} from 'react'
import {
  obtenerDashboard,
  DashboardData,
} from '@/services/dashboard'

import { useRouter } from 'next/navigation'
import styles from './dashboard.module.css'
import { useAuth } from '@/app/hooks/useAuth'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [dashboard, setDashboard] =
  useState<DashboardData | null>(null)
  
   useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
  if (!user) return

  obtenerDashboard()
    .then(setDashboard)
    .catch(console.error)
}, [user])

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

      <div className={styles.stats}>
      <div className={styles.card}>
        <h3>⭐ Puntos</h3>
        <p>{dashboard?.puntos ?? 0}</p>
      </div>

      <div className={styles.card}>
        <h3>🎟 Tickets</h3>
        <p>{dashboard?.ticketsActivos ?? 0}</p>
      </div>

      <div className={styles.card}>
        <h3>🍽 Mesa</h3>
        <p>{dashboard?.mesaActual ?? 'Ninguna'}</p>
      </div>
    </div>

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