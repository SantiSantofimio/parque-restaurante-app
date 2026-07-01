'use client'

import styles from './Banner.module.css'

export default function Banner() {
  return (
    <div className={styles.banner}>
      <div>
        <h2>
          ¡Compra tus entradas!
        </h2>

        <p>
          Obtén puntos extra esta
          semana.
        </p>

        <button>
          Comprar ahora
        </button>
      </div>
    </div>
  )
}