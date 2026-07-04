'use client'

import { usePathname, useRouter } from 'next/navigation'
import styles from './BottomNavigation.module.css'

export default function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const menu = [
    { icon: '🏠', text: 'Inicio', url: '/dashboard' },
    { icon: '🎟', text: 'Tickets', url: '/tickets' },
    { icon: '📱', text: 'QR', url: '/qr', qr: true },
    { icon: '🍽', text: 'Restaurante', url: '/mesas' },
    { icon: '👤', text: 'Perfil', url: '/perfil' },
  ]

  return (
    <nav className={styles.nav}>
      {menu.map(item => (
        <button
          key={item.url}
          onClick={() => router.push(item.url)}
          className={`${styles.item} ${
            pathname === item.url ? styles.active : ''
          } ${item.qr ? styles.qr : ''}`}
        >
          <span className={item.qr ? styles.qrIcon : ''}>{item.icon}</span>
          {!item.qr && <small>{item.text}</small>}
        </button>
      ))}
    </nav>
  )
}