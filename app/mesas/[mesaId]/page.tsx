'use client'

import {
  useEffect,
  useState,
} from 'react'
import {
  useParams,
  useRouter,
} from 'next/navigation'
import type {
  Mesa,
  Usuario,
  Pedido,
} from '@/types/mesas'
import styles from './mesa.module.css'
import { useAuth } from '@/app/hooks/useAuth'

const API_URL =
  'http://localhost:4000/api/mesas'

// ============================
// API pedido
// ============================
async function agregarPedido(
  mesaId: string,
  producto: string,
  precio: number,
  user: Usuario | null
) {
  const res = await fetch(
    `${API_URL}/${mesaId}/pedido`,
    {
      method: 'POST',
      headers:
        getAuthHeaders(user),
      body: JSON.stringify({
        producto,
        precio,
        cantidad: 1,
      }),
    }
  )

  if (!res.ok) {
    throw new Error(
      'Error agregando pedido'
    )
  }

  return res.json()
}

async function actualizarPedido(
  mesaId: string,
  producto: string,
  action: 'add' | 'remove'
) {
  const res = await fetch(
    `${API_URL}/${mesaId}/pedido`,
    {
      method: 'PUT',
      headers: {
        'Content-Type':
          'application/json',
      },
      body: JSON.stringify({
        producto,
        action,
      }),
    }
  )

  if (!res.ok) {
    throw new Error(
      'Error actualizando pedido'
    )
  }

  return res.json()
}

function getAuthHeaders(
  user: Usuario | null
) {
  return {
    'Content-Type':
      'application/json',
    ...(user && {
      'x-user-id':
        String(user.id),
      'x-user-name':
        user.name,
    }),
  }
}

export default function MesaDetallePage() {
  const params = useParams()
  const router = useRouter()

  const mesaId =
    params.mesaId as string

  const [mesa, setMesa] =
    useState<Mesa | null>(null)

  const [loading, setLoading] =
    useState(true)

  const { user, loading: authLoading, } =
    useAuth()

  const [showPagoModal, setShowPagoModal] =
    useState(false)

  // ============================
  // Obtener mesa
  // ============================
  useEffect(() => {
    async function fetchMesa() {
      try {
        const res =
          await fetch(
            API_URL,
            {
              headers: getAuthHeaders(
                user
              ),
            }
          )

        if (!res.ok) {
          throw new Error(
            'Backend no responde'
          )
        }

        const mesas: Mesa[] =
          await res.json()

        const mesaEncontrada =
          mesas.find(
            (m) =>
              m.id ===
              mesaId
          ) || null

        setMesa(
          mesaEncontrada
        )
      } catch (error) {
        console.error(
          'Error al obtener mesa',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    fetchMesa()

    const interval =
      setInterval(
      fetchMesa,
      3000
      )

    return () =>
      clearInterval(interval)
  }, [mesaId, user])

  // ============================
  // Agregar pedido
  // ============================
  async function handleAgregarPedido(
    producto: string,
    precio: number
  ) {
    try {
      await agregarPedido(
        mesaId,
        producto,
        precio,
        user
      )

      const res =
        await fetch(
          API_URL
        )

      const mesas: Mesa[] =
        await res.json()

      const mesaActual =
        mesas.find(
          (m) =>
            m.id ===
            mesaId
        ) || null

      setMesa(
        mesaActual
      )
    } catch (error) {
      console.error(error)

      alert(
        'Error agregando producto'
      )
    }
  }

  // ============================
// Actualizar pedido
// ============================
async function handleActualizarPedido(
  producto: string,
  action: 'add' | 'remove'
) {
  try {
    await actualizarPedido(
      mesaId,
      producto,
      action
    )

    // refrescar mesa
    const res =
      await fetch(API_URL)

    const mesas: Mesa[] =
      await res.json()

    const mesaActual =
      mesas.find(
        (m) =>
          m.id === mesaId
      ) || null

    setMesa(mesaActual)
  } catch (error) {
    console.error(error)

    alert(
      'Error actualizando pedido'
    )
  }
}

  // ============================
  // Salir mesa
  // ============================
  async function handleSalir() {
    try {
      await fetch(
        `${API_URL}/${mesaId}/salir`,
        {
          method: 'POST',
          headers: getAuthHeaders(user),
          body:
            JSON.stringify({
              user,
            }),
        }
      )

      router.push('/mesas')
    } catch (error) {
      console.error(error)

      alert(
        'Error al salir'
      )
    }
  }

  // ============================
// Confirmar pago
// ============================
async function confirmarPago() {
  try {
    const total =
      mesa?.pedidos?.reduce(
        (
          acc,
          pedido
        ) =>
          acc +
          pedido.total,
        0
      ) || 0

    await fetch(
      'http://localhost:4000/api/facturas',
      {
        method: 'POST',
        headers: getAuthHeaders(user),
        body:
          JSON.stringify({
            user,
            mesaId,
            pedidos:
              mesa?.pedidos ||
              [],
            total,
          }),
      }
    )

    alert(
      'Pago realizado ✅'
    )

    setShowPagoModal(
      false
    )

    await handleSalir()
  } catch (error) {
    console.error(error)

    alert(
      'Error procesando pago'
    )
  }
}

  // ============================
  // Salir y pagar
  // ============================
  async function handleSalirYPagar() {
    setShowPagoModal(
      true
    )
  }

  if (authLoading) {
    return (
      <h1> Cargando usuario... </h1>
    )
  }

  if (loading) {
    return (
      <h1>
        Cargando mesa...
      </h1>
    )
  }

  if (!mesa) {
    return (
      <h1>
        Mesa no encontrada
      </h1>
    )
  }

  return (
    <div
      className={
        styles.container
      }
    >
      <div
        className={
          styles.card
        }
      >
        <h1>
          🍽 {mesa.id}
        </h1>

        <p>
          Capacidad:{' '}
          {mesa.capacidad}
        </p>

        <p>
          Estado:{' '}
          {mesa.ocupada
            ? 'Ocupada'
            : 'Libre'}
        </p>

        <h2>
          Usuarios en mesa
        </h2>

        {mesa.usuarios.map(
          (u) => (
            <div key={u.id}>
              {u.name}
            </div>
          )
        )}

        <h2>
          Menú del restaurante
        </h2>

        <div
          className={
            styles.menuList
          }
        >
          <div
            className={
              styles.menuItem
            }
          >
            <div>
              <h3>
                🍔 Hamburguesa
              </h3>
              <p>$25.000</p>
            </div>

            <button
              className={
                styles.buttonPrimary
              }
              onClick={() =>
                handleAgregarPedido(
                  'Hamburguesa',
                  25000
                )
              }
            >
              Agregar
            </button>
          </div>

          <div
            className={
              styles.menuItem
            }
          >
            <div>
              <h3>
                🍕 Pizza
              </h3>
              <p>$38.000</p>
            </div>

            <button
              className={
                styles.buttonPrimary
              }
              onClick={() =>
                handleAgregarPedido(
                  'Pizza',
                  38000
                )
              }
            >
              Agregar
            </button>
          </div>

          <div
            className={
              styles.menuItem
            }
          >
            <div>
              <h3>
                🥤 Gaseosa
              </h3>
              <p>$6.000</p>
            </div>

            <button
              className={
                styles.buttonPrimary
              }
              onClick={() =>
                handleAgregarPedido(
                  'Gaseosa',
                  6000
                )
              }
            >
              Agregar
            </button>
          </div>
        </div>

        <h2>
  🧾 Pedido actual
</h2>

{mesa.pedidos?.length ? (
  <>
    <div
      className={
        styles.pedidoList
      }
    >
      {mesa.pedidos.map(
        (
          pedido: Pedido
        ) => (
          <div
            key={pedido.id}
            className={
              styles.pedidoItem
            }
          >
            <div>
              <strong>
                {
                  pedido.producto
                }
              </strong>

              <p>
                $
                {pedido.precio.toLocaleString()}
              </p>
            </div>

            <div
              className={
                styles.quantityControls
              }
            >
              <button
                onClick={() =>
                handleActualizarPedido(
                pedido.producto,
                'remove'
                )
              }
              >
                ➖
              </button>

              <span>
                {
                  pedido.cantidad
                }
              </span>

              <button
                onClick={() =>
                  handleActualizarPedido(
                    pedido.producto,
                    'add'
                  )
                }
              >
                ➕
              </button>
            </div>

            <div>
              $
              {pedido.total.toLocaleString()}
            </div>
          </div>
        )
      )}
    </div>

    <h3>
      Total: $
      {mesa.pedidos
        .reduce(
          (
            total,
            pedido
          ) =>
            total +
            pedido.total,
          0
        )
        .toLocaleString()}
    </h3>
  </>
) : (
  <p>
    No hay productos
    agregados
  </p>
)}

        <div
          className={
            styles.buttonGroup
          }
        >
          <button
            className={
              styles.buttonPrimary
            }
            onClick={
              handleSalir
            }
          >
            Salir de la mesa
          </button>

          <button
            className={
              styles.buttonDanger
            }
            onClick={
              handleSalirYPagar
            }
          >
            Salir y pagar
          </button>
        </div>
      </div>
      {showPagoModal && (
  <div
    className={
      styles.overlay
    }
  >
    <div
      className={
        styles.modal
      }
    >
      <h2>
        💳 Resumen de pago
      </h2>

      {mesa.pedidos?.map(
        (
          pedido: Pedido
        ) => (
          <div
            key={pedido.id}
          >
            {
              pedido.producto
            }{' '}
            x
            {
              pedido.cantidad
            }
            {' — '}
            $
            {pedido.total.toLocaleString()}
          </div>
        )
      )}

      <h3>
        Total: $
        {mesa.pedidos
          ?.reduce(
            (
              total,
              pedido
            ) =>
              total +
              pedido.total,
            0
          )
          .toLocaleString()}
      </h3>

      <div
        className={
          styles.buttonGroup
        }
      >
        <button
          className={
            styles.buttonPrimary
          }
          onClick={() =>
            setShowPagoModal(
              false
            )
          }
        >
          Cancelar
        </button>

        <button
          className={
            styles.buttonDanger
          }
          onClick={
            confirmarPago
          }
        >
          Pagar y salir
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}