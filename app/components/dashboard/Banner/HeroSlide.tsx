'use client'

import { useRouter } from 'next/navigation'
import styles from './HeroSlide.module.css'
import type { BannerItem } from './bannerData'

interface Props {
  banner: BannerItem
}

export default function HeroSlide({ banner }: Props) {
  const router = useRouter()

  return (
    <div className={styles.slide}>
      <span className={styles.emoji}>{banner.emoji}</span>

      <div className={styles.text}>
        <h2>{banner.title}</h2>
        <p>{banner.subtitle}</p>
      </div>

      <button
        className={styles.more}
        onClick={() => router.push(banner.route)}
      >
        {banner.button || 'Más'}
      </button>
    </div>
  )
}