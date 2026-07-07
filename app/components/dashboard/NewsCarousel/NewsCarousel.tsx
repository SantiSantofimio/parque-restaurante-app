'use client'

import Image from 'next/image'
import styles from './NewsCarousel.module.css'

interface News {
  id: string
  title: string
  description: string
  image: string
}

interface Props {
  news: News[]
}

export default function NewsCarousel({
  news,
}: Props) {
  if (!news.length) return null

  return (
    <>
      <h2 className={styles.title}>
        📰 Novedades
      </h2>

      <div className={styles.container}>
        {news.map(item => (
          <div
            key={item.id}
            className={styles.card}
          >
            <Image
              src={item.image}
              alt={item.title}
              className={styles.image}
              width={640}
              height={360}
            />

            <div className={styles.content}>
              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}