'use client'

import { useRouter } from 'next/navigation'
import styles from './Services.module.css'

import type { Service } from '@/app/services/content'

interface Props {
  services: Service[]
}

export default function Services({
  services,
}: Props) {
  const router = useRouter()

  return (
    <div className={styles.grid}>
      {services.map(service => (
        <div
          key={service.id}
          className={styles.card}
          onClick={() =>
            router.push(service.route)
          }
        >
          <span>
            {service.icon}
          </span>

          <h3>
            {service.title}
          </h3>
        </div>
      ))}
    </div>
  )
}