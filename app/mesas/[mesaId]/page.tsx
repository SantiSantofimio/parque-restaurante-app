'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import {
  obtenerMesa,
} from '@/services/mesas'

import type { Mesa } from '@/types/mesas'

import BackToHome from '@/app/components/BackToHome'

import MesaCard from '@/app/components/Restaurant/MesaCard/MesaCard'
import PedidoCard from '@/app/components/Restaurant/PedidoCard/PedidoCard'
import styles from './mesa.module.css'

export default function MesaDetallePage() {
  const params = useParams()

  const mesaId =
    params.mesaId as string

  const [mesa, setMesa] =
    useState<Mesa | null>(null)

  useEffect(() => {
    obtenerMesa(mesaId)
      .then(setMesa)
      .catch(console.error)
  }, [mesaId])

  if (!mesa) {
    return <h1>Cargando...</h1>
  }

  const total =
    mesa.pedidos?.reduce(
      (acc, p) => acc + p.total,
      0
    ) ?? 0

  return (
    <div className={styles.container}>
      <BackToHome />

      <MesaCard mesa={mesa} />

      <h2>Pedidos</h2>

      {mesa.pedidos?.length ? (
        mesa.pedidos.map(pedido => (
          <PedidoCard
            key={pedido.id}
            pedido={pedido}
          />
        ))
      ) : (
        <p>No hay pedidos</p>
      )}

      <div className={styles.total}>
        Total

        <strong>
          ${total.toLocaleString()}
        </strong>
      </div>

      <button
        className={styles.primary}
      >
        Pedir comida
      </button>

      <button
        className={styles.secondary}
      >
        Pagar
      </button>

      <button
        className={styles.danger}
      >
        Salir de la mesa
      </button>
    </div>
  )
}