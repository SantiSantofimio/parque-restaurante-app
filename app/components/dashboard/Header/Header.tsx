'use client'

import styles from './Header.module.css'

interface Props {
  name: string
}

export default function Header({ name }: Props) {
  return (
    <header className={styles.header}>
      <div>
        <small className={styles.welcome}>Bienvenido al Parque Turístico Yuma</small>
        <h2>¡Hola, {name}!</h2>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton} aria-label="Notificaciones">🔔</button>
        <button className={styles.avatar} aria-label="Perfil">👤</button>
      </div>
    </header>
  )
}