'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Header.module.css'

interface Props {
  name: string
}

export default function Header({ name }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className={styles.header}>
      <div>
        <small className={styles.welcome}>Bienvenido al Parque Turístico Yuma</small>
        <h2>¡Hola, {name}!</h2>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton}>🔔</button>

        <div className={styles.avatarWrapper} ref={menuRef}>
          <button
            className={styles.avatar}
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
