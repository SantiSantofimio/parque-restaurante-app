'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Header.module.css'

interface Props {
  name: string
}

export default function Header({ name }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  return (
    <header className={styles.header}>
      <div>
        <small className={styles.welcome}>Bienvenido al Parque Turístico Yuma</small>
        <h2>¡Hola, {name}!</h2>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton} aria-label="Notificaciones">🔔</button>

        {/* Avatar con menú */}
        <div className={styles.avatarWrapper}>
          <button
            className={styles.avatar}
            aria-label="Perfil"
            onClick={() => setOpen(!open)}
          >
            👤
          </button>

          {open && (
            <div className={styles.menu}>
              <p onClick={() => router.push('/perfil')}>Mi perfil</p>
              <p onClick={() => router.push('/puntos')}>Mis puntos</p>
              <p onClick={() => router.push('/amigos')}>Amigos</p>
              <p onClick={logout} className={styles.logout}>Cerrar sesión</p>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
