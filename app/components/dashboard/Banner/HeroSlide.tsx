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
      <div className={styles.content}>

        <span className={styles.emoji}>
          {banner.emoji}
        </span>

        <h2>{banner.title}</h2>

        <p>{banner.subtitle}</p>

        <button
          onClick={() => router.push(banner.route)}
        >
          {banner.button}
        </button>

      </div>
    </div>
  )
}