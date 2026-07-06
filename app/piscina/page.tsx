'use client'

import Image from 'next/image'
import styles from './piscina.module.css'
import BackToHome from '@/app/components/BackToHome'
import { useRouter } from 'next/navigation'

export default function PiscinaPage() {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <BackToHome />

      {/* Banner */}
      <div className={styles.banner}>
        <Image
          src="/promos/piscina.jpg"
          alt="Piscina Yuma"
          fill
          className={styles.bannerImage}
        />

        <div className={styles.bannerText}>
          <h1>Disfruta la Piscina Yuma</h1>
          <p>Un espacio perfecto para relajarte, divertirte y disfrutar con tu familia.</p>
        </div>
      </div>

      {/* Mensaje motivador */}
      <div className={styles.section}>
        <h2>¡Ven a nadar y disfruta un día inolvidable!</h2>
        <p>
          Nuestra piscina es uno de los lugares favoritos del parque.  
          Agua cristalina, ambiente familiar y actividades para todas las edades.
        </p>
      </div>

      {/* Botón de compra */}
      <button
        className={styles.button}
        onClick={() => router.push('/tickets')}
      >
        Comprar entradas 🏊
      </button>
    </div>
  )
}
