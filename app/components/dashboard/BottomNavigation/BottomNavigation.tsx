'use client'

import { usePathname, useRouter } from 'next/navigation'
import styles from './BottomNavigation.module.css'

export default function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const menu = [
    {
      icon: '🏠',
      text: 'Inicio',
      url: '/dashboard',
    },
    {
      icon: '🎟',
      text: 'Tickets',
      url: '/tickets',
    },
    {
      icon: '🍽',
      text: 'Restaurante',
      url: '/mesas',
    },
    {
      icon: '⭐',
      text: 'Puntos',
      url: '/puntos',
    },
    {
      icon: '👤',
      text: 'Perfil',
      url: '/perfil',
    },
  ]

  return (
    <nav className={styles.nav}>
      {menu.map(item => (
        <button
          key={item.url}
          onClick={() =>
            router.push(item.url)
          }
          className={
            pathname === item.url
              ? styles.active
              : ''
          }
        >
          <span>{item.icon}</span>

          <small>{item.text}</small>
        </button>
      ))}
    </nav>
  )
}