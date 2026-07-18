'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { obtenerMesa } from '@/services/mesas'
import type { Mesa } from '@/types/mesas'

import BackToHome from '@/app/components/BackToHome'
import MesaCard from '@/app/components/Restaurant/MesaCard/MesaCard'
import PedidoCard from '@/app/components/Restaurant/PedidoCard/PedidoCard'
import styles from './mesa.module.css'

import { MenuItem, obtenerMenu } from '@/services/menu'
import CategoryTabs from '@/app/components/Restaurant/CategoryTabs/CategoryTaps'
import MenuList from '@/app/components/Restaurant/MenuList/MenuList'


export default function MesaDetallePage() {
  const params = useParams()

  const mesaId =
    params.mesaId as string

  const [mesa, setMesa] =
    useState<Mesa | null>(null)
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [categoria, setCategoria] = useState('Todos')

  useEffect(() => {
    obtenerMesa(mesaId)
      .then(setMesa)
      .catch(console.error)
  }, [mesaId])

   useEffect(() => {
  obtenerMenu()
    .then(setMenu)
    .catch(console.error)
}, [])

  if (!mesa) {
    return <h1>Cargando...</h1>
  }

  const total =
    mesa.pedidos?.reduce(
      (acc, p) => acc + p.total,
      0
    ) ?? 0

  const categorias = [
    'Todos',
    ...new Set(menu.map(p => p.categoria)),
  ]

  const productosFiltrados =
    categoria === 'Todos'
    ? menu
    : menu.filter(
        p => p.categoria === categoria
      )

  return (
    <div className={styles.container}>
      <BackToHome />

      <MesaCard mesa={mesa} />

      <CategoryTabs
        categorias={categorias}
        categoriaActiva={categoria}
        onSeleccionar={setCategoria}
      />

      <MenuList
      productos={productosFiltrados}
      onAgregar={(producto) => {
        // Aquí puedes manejar la acción de agregar un producto al pedido
        console.log('Producto agregado:', producto)
      }}
      />

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