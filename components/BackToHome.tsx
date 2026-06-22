'use client'

import { useRouter } from 'next/navigation'
import styles from './BackToHome.module.css'

export default function BackToHome() {
  const router = useRouter()

  return (
    <button
      className={styles.button}
      onClick={() => router.push('/dashboard')}
    >
      ← Volver al inicio
    </button>
  )
}