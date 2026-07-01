'use client'

import { useRouter } from 'next/navigation'
import styles from './Services.module.css'

const servicios = [
  {
    icono: '🏊',
    titulo: 'Piscina',
    ruta: '/tickets',
  },
  {
    icono: '🍽',
    titulo: 'Restaurante',
    ruta: '/mesas',
  },
  {
    icono: '🍹',
    titulo: 'Bar',
    ruta: '/bar',
  },
  {
    icono: '🥾',
    titulo: 'Tours',
    ruta: '/recorridos',
  },
  {
    icono: '🎉',
    titulo: 'Eventos',
    ruta: '/eventos',
  },
  {
    icono: '🎁',
    titulo: 'Premios',
    ruta: '/puntos',
  },
]

export default function Services() {
  const router = useRouter()

  return (
    <div className={styles.grid}>
      {servicios.map(s => (
        <div
          key={s.titulo}
          className={styles.card}
          onClick={() =>
            router.push(s.ruta)
          }
        >
          <span>{s.icono}</span>

          <h3>{s.titulo}</h3>
        </div>
      ))}
    </div>
  )
}