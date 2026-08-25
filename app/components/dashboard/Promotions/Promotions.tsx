'use client'

import Image from 'next/image'
import styles from './Promotions.module.css'
import type { Promotion } from '@/app/services/content'

interface Props {
  promotions: Promotion[]
}

export default function Promotions({ promotions }: Props) {
  if (!promotions.length) return null

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Promociones</h2>

      <div className={styles.list}>
        {promotions.map(promo => {

        return (
          <div key={promo.id} className={styles.card}>
            <Image
              src={promo.image}
              alt={promo.title}
              width={260}
              height={140}
              className={styles.image}
            />
            <h3>{promo.title}</h3>
            <p>{promo.description}</p>
          </div>
        )
      })}
      </div>
    </div>
  )
}
