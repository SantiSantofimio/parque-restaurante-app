'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  useParams,
} from 'next/navigation'

import {
  obtenerMesa,
} from '@/services/mesas'

import type {
  Mesa,
} from '@/types/mesas'

import {
  obtenerMenu,
  type MenuItem,
} from '@/services/menu'

import {
  useCart,
} from '@/app/components/Restaurant/CartContext/CartContext'

import CartButton from '@/app/components/Restaurant/CartButton/CartButton'

import CartDrawer from '@/app/components/Restaurant/CartDrawer/CartDrawer'

import BackToHome from '@/app/components/BackToHome'

import MesaCard from '@/app/components/Restaurant/MesaCard/MesaCard'

import PedidoCard from '@/app/components/Restaurant/PedidoCard/PedidoCard'

import CategoryTabs from '@/app/components/Restaurant/CategoryTabs/CategoryTabs'

import MenuList from '@/app/components/Restaurant/MenuList/MenuList'

import ProductModal, {
  type ProductSelection,
} from '@/app/components/Restaurant/ProductModal/ProductModal'

import styles from './mesa.module.css'

export default function MesaDetallePage() {
  // ============================
  // Parámetros
  // ============================

  const params = useParams()

  const mesaId =
    params.mesaId as string

  // ============================
  // Carrito
  // ============================

  const {
    agregarProducto,
    totalProductos,
    totalPrecio,
  } = useCart()

  // ============================
  // Estados
  // ============================

  const [
    mesa,
    setMesa,
  ] = useState<Mesa | null>(null)

  const [
    menu,
    setMenu,
  ] = useState<MenuItem[]>([])

  const [
    categoria,
    setCategoria,
  ] = useState('Todos')

  const [
    productoSeleccionado,
    setProductoSeleccionado,
  ] = useState<MenuItem | null>(null)

  const [
    cartAbierto,
    setCartAbierto,
  ] = useState(false)

  // ============================
  // Cargar mesa
  // ============================

  useEffect(() => {
    if (!mesaId) return

    obtenerMesa(mesaId)
      .then(setMesa)
      .catch(console.error)
  }, [mesaId])

  // ============================
  // Cargar menú
  // ============================

  useEffect(() => {
    obtenerMenu()
      .then(setMenu)
      .catch(console.error)
  }, [])

  // ============================
  // Estado de carga
  // ============================

  if (!mesa) {
    return (
      <h1>
        Cargando...
      </h1>
    )
  }

  // ============================
  // Total pedidos confirmados
  // ============================

  const total =
    mesa.pedidos?.reduce(
      (acc, pedido) =>
        acc + pedido.total,
      0
    ) ?? 0

  // ============================
  // Categorías
  // ============================

  const categorias = [
    'Todos',
    ...new Set(
      menu.map(
        producto =>
          producto.categoria
      )
    ),
  ]

  // ============================
  // Productos filtrados
  // ============================

  const productosFiltrados =
    categoria === 'Todos'
      ? menu.filter(
          producto =>
            producto.disponible
        )
      : menu.filter(
          producto =>
            producto.categoria ===
              categoria &&
            producto.disponible
        )

  // ============================
  // Agregar producto al carrito
  // ============================

  function handleAgregarProducto(
    seleccion: ProductSelection
  ) {
    agregarProducto(seleccion)
  }

  // ============================
  // Render
  // ============================

  return (
    <div
      className={styles.container}
    >
      <BackToHome />

      {/* ======================
          INFORMACIÓN DE MESA
      ====================== */}

      <MesaCard
        mesa={mesa}
      />

      {/* ======================
          MENÚ
      ====================== */}

      <section>
        <h2>
          Menú
        </h2>

        <CategoryTabs
          categorias={categorias}
          categoriaActiva={categoria}
          onSeleccionar={
            setCategoria
          }
        />

        <MenuList
          productos={
            productosFiltrados
          }
          onAgregar={
            producto =>
              setProductoSeleccionado(
                producto
              )
          }
        />
      </section>

      {/* ======================
          PRODUCT MODAL
      ====================== */}

      <ProductModal
        producto={
          productoSeleccionado
        }
        onCerrar={() =>
          setProductoSeleccionado(
            null
          )
        }
        onAgregar={
          handleAgregarProducto
        }
      />

      {/* ======================
              CARRITO
      ====================== */}

      <CartButton
        cantidad={totalProductos}
        total={totalPrecio}
        onClick={() =>
          setCartAbierto(true)
        }
      />

      <CartDrawer
        abierto={cartAbierto}
        onCerrar={() =>
          setCartAbierto(false)
        }
        onConfirmar={() =>
          console.log(
            'Confirmar pedido',
            mesaId
          )
           /*
            SIGUIENTE PASO:

            await crearPedido(
              mesaId,
              items
            )
          */
        }
      />

      {/* ======================
          PEDIDOS CONFIRMADOS
      ====================== */}

      <section>
        <h2>
          Pedidos
        </h2>

        {mesa.pedidos?.length ? (
          mesa.pedidos.map(
            pedido => (
              <PedidoCard
                key={pedido.id}
                pedido={pedido}
              />
            )
          )
        ) : (
          <p>
            No hay pedidos
          </p>
        )}
      </section>

      {/* ======================
          TOTAL PEDIDOS
      ====================== */}

      <div
        className={styles.total}
      >
        <span>
          Total
        </span>

        <strong>
          $
          {total.toLocaleString()}
        </strong>
      </div>

      {/* ======================
          ACCIONES
      ====================== */}

      <button
        className={
          styles.primary
        }
      >
        Pedir comida
      </button>

      <button
        className={
          styles.secondary
        }
      >
        Pagar
      </button>

      <button
        className={
          styles.danger
        }
      >
        Salir de la mesa
      </button>
    </div>
  )
}