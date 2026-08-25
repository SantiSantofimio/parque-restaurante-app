'use client'

import { 
  useEffect, 
  useState 
} from 'react'
import {
  obtenerDashboard,
  DashboardData,
} from '@/app/services/dashboard'
import { 
  obtenerContenido,
  ContentData,
} from '@/app/services/content'

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
import NewsCarousel from '../components/dashboard/NewsCarousel/NewsCarousel'
import EventsCarousel from '../components/dashboard/EventsCarousel/EventsCarousel'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [dashboard, setDashboard] =
  useState<DashboardData | null>(null)
  const [content, setContent] =
  useState<ContentData | null>(null)

  useEffect(() => {
    if (!user) return

    obtenerContenido()
      .then(setContent)
      .catch(console.error)
  }, [user])
  
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

      <PointsCard
        puntos={dashboard?.puntos ?? 0}
      />

      <Recommendations recomendaciones = {dashboard?.recomendaciones ?? []} />

      <Banner 
        banners={content?.banners ?? []}
      />

      <Services 
        services={content?.services ?? []}
      />

      <Promotions 
        promotions={content?.promotions ?? []}
      />

      <NewsCarousel
        news={content?.news ?? []}
      />

      <EventsCarousel
        events={content?.events ?? []}
      />

      <RecentActivity />
      
      <BottomNavigation />
    </div>
  )
}