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
      <div className={styles.header}>
        <h1 className={styles.title}>
          🌴 Parque Turístico Yuma
        </h1>
        <p className={styles.subtitle}>
          Bienvenido de nuevo
        </p>
        <h2 className={styles.userName}>
          {user?.name ?? 'Usuario'}
        </h2>
      </div>

      <div className={styles.statCard}>
          <span className={styles.icon}>⭐</span>

          <div>
            <h3>Puntos</h3>
          
            <strong>
              {dashboard?.puntos ?? 0}
            </strong>
          </div>
      </div>

      <div className={styles.statCard}>
          <span className={styles.icon}>🎟</span>

          <div>
            <h3>Tickets</h3>
          
            <strong>
              {dashboard?.ticketsActivos ?? 0}
            </strong>
          </div>
      </div>

      <div className={styles.statCard}>
          <span className={styles.icon}>🍽</span>

          <div>
            <h3>Mesa</h3>
          
            <strong>
              {dashboard?.mesaActual ?? 'Ninguna'}
            </strong>
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
        <button
          onClick={() => router.push('/perfil')}
          className={styles.card}
        >
          👤 Mi perfil
        </button>
      </div>
    </div>
  )
}