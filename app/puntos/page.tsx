'use client'

import { useEffect, useState } from 'react'

import BackToHome from '@/app/components/BackToHome'

import {
  obtenerPuntos,
  MovimientoPuntos,
} from '@/app/services/puntos'

import styles from './puntos.module.css'

interface Data {
  puntos: number
  historial: MovimientoPuntos[]
}

export default function PuntosPage() {

  const [data, setData] =
    useState<Data | null>(null)

  useEffect(() => {
    obtenerPuntos()
      .then(setData)
      .catch(console.error)
  }, [])

  if (!data) {
    return <h2>Cargando...</h2>
  }

  const puntos = data.puntos

  function nivel() {

    if (puntos >= 5000)
      return 'Diamante'

    if (puntos >= 2500)
      return 'Oro'

    if (puntos >= 1000)
      return 'Plata'

    return 'Bronce'
  }

  function siguienteNivel() {

    if (puntos < 1000)
      return 1000

    if (puntos < 2500)
      return 2500

    if (puntos < 5000)
      return 5000

    return 5000
  }

  const progreso = Math.min(
    (puntos / siguienteNivel()) * 100,
    100
  )

  return (
    <div className={styles.container}>

      <BackToHome />

      <div className={styles.card}>

        <h1>
          ⭐ Mis puntos
        </h1>

        <h2>
          {puntos}
        </h2>

        <p>
          Nivel {nivel()}
        </p>

        <div className={styles.progress}>
          <div
            className={styles.fill}
            style={{
              width: `${progreso}%`,
            }}
          />
        </div>

        <small>

          {Math.max(
            0,
            siguienteNivel() - puntos
          )}

          {' '}
          puntos para subir de nivel

        </small>

      </div>

      <div className={styles.history}>

        <h2>

          Historial

        </h2>

        {data.historial.length === 0 && (

          <p>

            Aún no tienes movimientos.

          </p>

        )}

        {data.historial.map(item => (

          <div
            key={item.id}
            className={styles.item}
          >

            <div>

              <strong>

                +{item.puntos} ⭐

              </strong>

              <p>

                {item.descripcion}

              </p>

            </div>

            <small>

              {new Date(
                item.fecha
              ).toLocaleDateString()}

            </small>

          </div>

        ))}

      </div>

    </div>
  )
}