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

import Header from '@/app/components/dashboard/Header/Header'
import PointsCard from '@/app/components/dashboard/PointsCard/PointsCard'
import Banner from '@/app/components/dashboard/Banner/Banner'
import Services from '@/app/components/dashboard/Services/Services'

import Promotions from '@/app/components/dashboard/Promotions/Promotions'
import RecentActivity from '@/app/components/dashboard/RecentActivity/RecentActivity'
import BottomNavigation from '@/app/components/dashboard/BottomNavigation/BottomNavigation'
import SearchBar from '../components/dashboard/SearchBar/SearchBar'
import Recommendations from '../components/dashboard/Recommendations/Recommendations'

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

      <Header 
        name={dashboard?.name ?? user?.name ?? ''}
      />

      <SearchBar />

      <Recommendations recomendaciones = {dashboard?.recomendaciones ?? []} />

      <PointsCard
        puntos={dashboard?.puntos ?? 0}
      />

      <Banner />

      <Services />

      <Promotions />

      <RecentActivity />
      
      <BottomNavigation />
    </div>
  )
}