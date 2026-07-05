'use client'

import styles from './Promotions.module.css'

import type { Promotion } from '@/services/content'

interface Props {
  promotions: Promotion[]
}

export default function Promotions({
  promotions,
}: Props) {
  if (!promotions.length) return null

  return (
    <>
      <h2 className={styles.title}>
        Promociones
      </h2>

      <div className={styles.container}>
        {promotions.map(promotion => (
          <div
            key={promotion.id}
            className={styles.card}
          >
            <h3>
              {promotion.title}
            </h3>

            <p>
              {promotion.description}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}