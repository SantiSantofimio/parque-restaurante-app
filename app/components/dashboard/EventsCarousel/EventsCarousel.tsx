'use client'

import styles from './EventsCarousel.module.css'
import Image from 'next/image'

interface Event {
  id: string
  title: string
  date: string
  image: string
}

interface Props {
  events: Event[]
}

export default function EventsCarousel({
  events,
}: Props) {
  if (!events.length) return null

  return (
    <>
      <h2 className={styles.title}>
        🎉 Próximos eventos
      </h2>

      <div className={styles.container}>
        {events.map(event => (
          <div
            key={event.id}
            className={styles.card}
          >
            <Image
              src={event.image}
              alt={event.title}
              className={styles.image}
              width={640}
              height={360}
            />

            <div className={styles.overlay}>
              <span className={styles.date}>
                {event.date}
              </span>

              <h3>{event.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}