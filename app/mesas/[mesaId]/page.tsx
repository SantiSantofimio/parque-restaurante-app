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
  confirmarPedido,
} from '@/services/mesas'

import type {
  Mesa,
  PedidoInput,
} from '@/types/mesas'

import {
  obtenerMenu,
  type MenuItem,
} from '@/services/menu'

import {
  useCart,
} from '@/app/components/Restaurant/CartContext/CartContext'

import BackToHome from '@/app/components/BackToHome'

import MesaCard from '@/app/components/Restaurant/MesaCard/MesaCard'

import PedidoCard from '@/app/components/Restaurant/PedidoCard/PedidoCard'

import CategoryTabs from '@/app/components/Restaurant/CategoryTabs/CategoryTabs'

import MenuList from '@/app/components/Restaurant/MenuList/MenuList'

import ProductModal, {
  type ProductSelection,
} from '@/app/components/Restaurant/ProductModal/ProductModal'

import CartButton from '@/app/components/Restaurant/CartButton/CartButton'

import CartDrawer from '@/app/components/Restaurant/CartDrawer/CartDrawer'

import styles from './mesa.module.css'


export default function MesaDetallePage() {

  // ============================
  // Parámetros
  // ============================

  const params = useParams()

  const mesaId =
    params.mesaId as string


  // ============================
  // Cart Context
  // ============================

  const {
    items,
    agregarProducto,
    vaciarCarrito,
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
    carritoAbierto,
    setCarritoAbierto,
  ] = useState(false)

  const [
    confirmandoPedido,
    setConfirmandoPedido,
  ] = useState(false)


  // ============================
  // Cargar mesa
  // ============================

  useEffect(() => {

    if (!mesaId) {
      return
    }

    obtenerMesa(mesaId)
      .then(setMesa)
      .catch(error => {
        console.error(
          'Error cargando mesa:',
          error
        )
      })

  }, [mesaId])


  // ============================
  // Cargar menú
  // ============================

  useEffect(() => {

    obtenerMenu()
      .then(setMenu)
      .catch(error => {
        console.error(
          'Error cargando menú:',
          error
        )
      })

  }, [])


  // ============================
  // Agregar producto
  // al carrito
  // ============================

  function handleAgregarProducto(
    seleccion: ProductSelection
  ) {

    agregarProducto(
      seleccion
    )
  }


  // ============================
  // Confirmar pedido
  // ============================

  async function handleConfirmarPedido() {

    // Evitar doble click
    if (confirmandoPedido) {
      return
    }

    // Validar carrito
    if (!items.length) {
      alert(
        'Tu carrito está vacío'
      )

      return
    }

    try {

      setConfirmandoPedido(
        true
      )

      // ==========================
      // Convertir CartItems
      // al formato del backend
      // ==========================

      const productos:
        PedidoInput[] =
        items.map(item => ({

          productoId:
            item.producto.id,

          cantidad:
            item.cantidad,

          observaciones:
            item.observaciones,

        }))


      // ==========================
      // Enviar pedido
      // ==========================

      const response =
        await confirmarPedido(
          mesaId,
          productos
        )


      // ==========================
      // Actualizar mesa
      // ==========================

      setMesa(
        response.mesa
      )


      // ==========================
      // Vaciar carrito
      // ==========================

      vaciarCarrito()


      // ==========================
      // Cerrar drawer
      // ==========================

      setCarritoAbierto(
        false
      )


      // ==========================
      // Confirmación
      // ==========================

      alert(
        response.message ||
        'Pedido confirmado correctamente'
      )

    } catch (error) {

      console.error(
        'Error confirmando pedido:',
        error
      )

      if (
        error instanceof Error
      ) {

        alert(
          error.message
        )

      } else {

        alert(
          'No se pudo confirmar el pedido'
        )

      }

    } finally {

      setConfirmandoPedido(
        false
      )

    }
  }


  // ============================
  // Estado de carga
  // ============================

  if (!mesa) {

    return (
      <div
        className={
          styles.container
        }
      >

        <BackToHome />

        <h1>
          Cargando mesa...
        </h1>

      </div>
    )

  }


  // ============================
  // Total pedidos confirmados
  // ============================

  const total =
    mesa.pedidos?.reduce(
      (
        acumulado,
        pedido
      ) =>
        acumulado +
        pedido.total,
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
  // Productos disponibles
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
  // Render
  // ============================

  return (

    <div
      className={
        styles.container
      }
    >

      <BackToHome />


      {/* ======================
          INFORMACIÓN MESA
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

          categorias={
            categorias
          }

          categoriaActiva={
            categoria
          }

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
          PEDIDOS CONFIRMADOS
      ====================== */}

      <section>

        <h2>
          Pedidos de la mesa
        </h2>


        {mesa.pedidos?.length ? (

          mesa.pedidos.map(
            pedido => (

              <PedidoCard

                key={
                  pedido.id
                }

                pedido={
                  pedido
                }

              />

            )
          )

        ) : (

          <p>
            No hay pedidos
            confirmados.
          </p>

        )}

      </section>


      {/* ======================
          TOTAL MESA
      ====================== */}

      <div
        className={
          styles.total
        }
      >

        <span>
          Total de la mesa
        </span>

        <strong>

          $

          {total
            .toLocaleString()}

        </strong>

      </div>


      {/* ======================
          PAGAR
      ====================== */}

      <button
        type="button"
        className={
          styles.secondary
        }
        disabled={
          !mesa.pedidos?.length
        }
      >

        Pagar

      </button>


      {/* ======================
          SALIR MESA
      ====================== */}

      <button
        type="button"
        className={
          styles.danger
        }
      >

        Salir de la mesa

      </button>


      {/* ======================
          BOTÓN CARRITO
      ====================== */}

      <CartButton

        cantidad={
          totalProductos
        }

        total={
          totalPrecio
        }

        onClick={() =>
          setCarritoAbierto(
            true
          )
        }

      />


      {/* ======================
          CART DRAWER
      ====================== */}

      <CartDrawer

        abierto={
          carritoAbierto
        }

        confirmando={
          confirmandoPedido
        }

        onCerrar={() =>
          setCarritoAbierto(
            false
          )
        }

        onConfirmar={
          handleConfirmarPedido
        }

      />

    </div>

  )
}