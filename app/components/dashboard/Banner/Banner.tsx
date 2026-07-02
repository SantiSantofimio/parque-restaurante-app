'use client'

import { useEffect, useState } from 'react'

import HeroSlide from './HeroSlide'

import { banners } from './bannerData'

import styles from './Banner.module.css'

export default function Banner() {

  const [index, setIndex] = useState(0)

  useEffect(() => {

    const timer = setInterval(() => {

      setIndex(prev =>

        prev === banners.length - 1

          ? 0

          : prev + 1

      )

    }, 5000)

    return () => clearInterval(timer)

  }, [])

  return (

    <div>

      <HeroSlide banner={banners[index]} />

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