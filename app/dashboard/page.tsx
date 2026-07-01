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

import PointsCard from '@/components/dashboard/PointsCard/PointsCard'
import Banner from '@/components/dashboard/Banner/Banner'
import Services from '@/components/dashboard/Services/Services'

import Promotions from '@/components/dashboard/Promotions/Promotions'
import RecentActivity from '@/components/dashboard/RecentActivity/RecentActivity'
import BottomNavigation from '@/components/dashboard/BottomNavigation/BottomNavigation'

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
      <PointsCard
        puntos={dashboard?.puntos ?? 0}/>

      <Banner />

      <Services />

      <Promotions />

      <RecentActivity />
      
      <BottomNavigation />
    </div>
  )
}