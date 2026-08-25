'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  useParams,
  useRouter,
} from 'next/navigation'

import {
  obtenerMesa,
  salirDeMesa,
  confirmarPedido,
} from '@/app/services/mesas'

import type {
  Mesa,
  PedidoInput,
} from '@/types/mesas'

import {
  obtenerMenu,
  type MenuItem,
} from '@/app/services/menu'

import {
  useCart,
} from '@/app/components/Restaurant/CartContext/CartContext'

import BackToHome from '@/app/components/BackToHome'

import MesaCard from '@/app/components/Restaurant/MesaCard/MesaCard'

import CategoryTabs from '@/app/components/Restaurant/CategoryTabs/CategoryTabs'

import MenuList from '@/app/components/Restaurant/MenuList/MenuList'

import ProductModal, {
  type ProductSelection,
} from '@/app/components/Restaurant/ProductModal/ProductModal'

import CartButton from '@/app/components/Restaurant/CartButton/CartButton'

import CartDrawer from '@/app/components/Restaurant/CartDrawer/CartDrawer'

import PaymentModal from '@/app/components/Restaurant/PaymentModal/PaymentModal'

import {
  pagarPedidos,
  type TipoPago,
} from '@/app/services/facturas'

import { useAuth } from '@/app/hooks/useAuth'

import styles from './mesa.module.css'
import OrderByUser from '@/app/components/Restaurant/OrderByUser/OrderByUser';


export default function MesaDetallePage() {


  // ============================
  // PayMent Modal
  // ============================

  const {
    user,
    loading:
      authLoading,
   } = useAuth()


  // ============================
  // Parámetros
  // ============================

  const params = useParams()

  const router = useRouter()

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

  const [
    pagoAbierto,
    setPagoAbierto,
  ] = useState(false)

  const [
    pagando,
    setPagando,
  ] = useState(false)

  const [
    saliendo,
    setSaliendo,
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
  // Pagar pedidos
  // ============================

  async function handlePagar(
    tipoPago:
      TipoPago
    ) {

    if (
      !user ||
      pagando
    ) {
      return
    }


    try {

      setPagando(
        true
      )


      const response =
        await pagarPedidos(
          mesaId,
          tipoPago
        )


      // ==========================
      // Actualizar mesa
      // ==========================

      setMesa(
        response.mesa
      )


      // ==========================
      // Cerrar modal
      // ==========================

      setPagoAbierto(
        false
      )


      // ==========================
      // Confirmación
      // ==========================

      alert(
        `Pago realizado correctamente.

    Factura: ${response.factura.id}

    Total pagado: $${response.factura.total.toLocaleString()}`
      )


    } catch (
      error
    ) {

      console.error(
        'Error realizando pago:',
        error
      )


      if (
        error instanceof
        Error
      ) {

        alert(
          error.message
        )

      } else {

        alert(
          'No se pudo realizar el pago'
        )

      }

    } finally {

      setPagando(
        false
      )

    }

  }


// ============================
// Confirmar pedido
// ============================

async function handleConfirmarPedido() {
  if (confirmandoPedido) {
    return
  }

  if (!user) {
    alert(
      'Debes iniciar sesión para realizar un pedido'
    )

    return
  }

  if (!items.length) {
    alert(
      'Tu carrito está vacío'
    )

    return
  }

  try {
    setConfirmandoPedido(true)

    // ============================
    // CartItem -> PedidoInput
    // ============================

    const productos:
      PedidoInput[] =
      items.map(item => ({
        productoId:
          String(
            item.producto.id
          ),

        cantidad:
          item.cantidad,

        observaciones:
          item.observaciones,
      }))

    // ============================
    // Confirmar en backend
    // ============================

    const response =
      await confirmarPedido(
        mesaId,
        productos
      )

    // ============================
    // Actualizar mesa
    // ============================

    setMesa(
      response.mesa
    )

    // ============================
    // Limpiar carrito
    // ============================

    vaciarCarrito()

    setCarritoAbierto(
      false
    )

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

  if ( authLoading || !mesa || !user ) {

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
  // Productos disponibles
  // ============================
  async function handleSalirMesa() {

  if (
    saliendo
  ) {
    return
  }


  const confirmar =
    window.confirm(
      '¿Seguro que quieres salir de esta mesa?'
    )


  if (
    !confirmar
  ) {
    return
  }


  try {

    setSaliendo(
      true
    )


    const response =
      await salirDeMesa(
        mesaId
      )


    alert(
      response.message
    )


    // ==========================
    // Volver al listado
    // ==========================

    router.push(
      '/mesas'
    )


  } catch (
    error
  ) {

    console.error(
      'Error saliendo de mesa:',
      error
    )


    if (
      error instanceof
      Error
    ) {

      alert(
        error.message
      )

    } else {

      alert(
        'No se pudo salir de la mesa'
      )

    }

  } finally {

    setSaliendo(
      false
    )

  }

}

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

        <OrderByUser
          pedidos={
            mesa.pedidos ?? []
          }
          currentUserId={user.id}
        />

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

        onClick={() =>
          setPagoAbierto(
            true
          )
        }
        >

        💳 Pagar

      </button>

      {/* ======================
          PAYMENT MODAL
      ====================== */}

      {
        user && (

          <PaymentModal

            abierto={
              pagoAbierto
            }

            pedidos={
              mesa.pedidos
            }

            userId={
              user.id
            }

            pagando={
              pagando
            }

            onCerrar={() =>
              setPagoAbierto(
                false
              )
            }

            onConfirmar={
              handlePagar
            }
          />
        )
      }


      {/* ======================
          SALIR MESA
      ====================== */}

      <button
        type="button"
        className={
          styles.danger
        }

        onClick={() =>
          handleSalirMesa()
        }

        disabled={
          saliendo
        }
      >

        {saliendo
          ? 'Saliendo...'
          : '🚪 Salir de la mesa'}

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