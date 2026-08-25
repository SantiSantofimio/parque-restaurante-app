'use client'

import { useEffect, useState } from 'react'
import HeroSlide from './HeroSlide'
import styles from './Banner.module.css'

import type { Banner as BannerType } from '@/app/services/content'

interface Props {
  banners: BannerType[]
}

export default function Banner({
  banners,
}: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return

    const timer = setInterval(() => {
      setIndex(prev =>
        prev === banners.length - 1
          ? 0
          : prev + 1
      )
    }, 5000)

    return () => clearInterval(timer)
  }, [banners])

  if (!banners.length) return null

  return (
    <div className={styles.bannerContainer}>
      <HeroSlide
        banner={banners[index]}
      />

      <div className={styles.dots}>
        {banners.map((_, i) => (
          <span
            key={i}
            className={
              i === index
                ? styles.active
                : ''
            }
          />
        ))}
      </div>
    </div>
  )
}