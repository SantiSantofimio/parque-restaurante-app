'use client'

import styles from './RecentActivity.module.css'

const actividad = [
  {
    icono: '🎟',
    texto: 'Compraste 2 entradas',
    fecha: 'Hoy',
  },
  {
    icono: '🍽',
    texto: 'Pedido Restaurante',
    fecha: 'Ayer',
  },
  {
    icono: '⭐',
    texto: '+35 puntos',
    fecha: 'Ayer',
  },
]

export default function RecentActivity() {
  return (
    <>
      <h2 className={styles.title}>
        Actividad reciente
      </h2>

      {actividad.map((a, i) => (
        <div
          key={i}
          className={styles.item}
        >
          <span>{a.icono}</span>

          <div>
            <h4>{a.texto}</h4>

            <small>{a.fecha}</small>
          </div>
        </div>
      ))}
    </>
  )
}