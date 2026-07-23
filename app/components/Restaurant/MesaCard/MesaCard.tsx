'use client'

import type { Mesa } from '@/types/mesas'
import styles from './MesaCard.module.css'

interface Props {
  mesa: Mesa
  estoyAqui?: boolean
  tengoOtraMesa?: boolean
  onEntrar?: () => void
  onIrAMesa?: () => void
}

export default function MesaCard({
  mesa,
  estoyAqui = false,
  tengoOtraMesa = false,
  onEntrar,
  onIrAMesa,
}: Props) {
  const personas =
    mesa.usuarios?.length ?? 0

  const espaciosDisponibles =
    Math.max(
      mesa.capacidad - personas,
      0
    )

  const mesaLlena =
    espaciosDisponibles === 0

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3>{mesa.id}</h3>

          <span className={styles.status}>
            {mesaLlena
              ? '🔴 Llena'
              : personas > 0
                ? '🟡 Ocupada'
                : '🟢 Disponible'}
          </span>
        </div>

        <span className={styles.people}>
          👥 {personas}/{mesa.capacidad}
        </span>
      </div>

      <div className={styles.info}>
        <p>
          Capacidad:
          <strong>
            {' '}
            {mesa.capacidad} personas
          </strong>
        </p>

        <p>
          Espacios disponibles:
          <strong>
            {' '}
            {espaciosDisponibles}
          </strong>
        </p>
      </div>

      {estoyAqui && (
        <div className={styles.current}>
          👤 Estás en esta mesa
        </div>
      )}

      <div className={styles.actions}>
        {estoyAqui && onIrAMesa && (
          <button
            type="button"
            className={styles.primary}
            onClick={onIrAMesa}
          >
            Ir a mi mesa
          </button>
        )}

        {!estoyAqui &&
          !tengoOtraMesa &&
          !mesaLlena &&
          onEntrar && (
            <button
              type="button"
              className={styles.primary}
              onClick={onEntrar}
            >
              {personas > 0
                ? 'Unirme a la mesa'
                : 'Entrar'}
            </button>
          )}

        {!estoyAqui &&
          tengoOtraMesa && (
            <button
              type="button"
              className={styles.disabled}
              disabled
            >
              Ya estás en otra mesa
            </button>
          )}

        {!estoyAqui &&
          !tengoOtraMesa &&
          mesaLlena && (
            <button
              type="button"
              className={styles.disabled}
              disabled
            >
              Mesa llena
            </button>
          )}
      </div>
    </article>
  )
}