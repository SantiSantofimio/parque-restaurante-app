'use client'

import styles from './Promotions.module.css'

const promociones = [
  {
    titulo: '2x1 Piscina',
    descripcion: 'Solo este fin de semana',
    color: '#00b894',
  },
  {
    titulo: '20% Restaurante',
    descripcion: 'Comprando desde la App',
    color: '#fdcb6e',
  },
  {
    titulo: 'Recorrido Nocturno',
    descripcion: 'Nueva experiencia',
    color: '#6c5ce7',
  },
]

export default function Promotions() {
  return (
    <>
      <h2 className={styles.title}>
        Promociones
      </h2>

      <div className={styles.container}>
        {promociones.map(p => (
          <div
            key={p.titulo}
            className={styles.card}
            style={{
              background: p.color,
            }}
          >
            <h3>{p.titulo}</h3>

            <p>{p.descripcion}</p>
          </div>
        ))}
      </div>
    </>
  )
}