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

const API_URL =
  'http://localhost:4000/api/mesas'

// ============================
// API pedido
// ============================
async function agregarPedido(
  mesaId: string,
  producto: string,
  precio: number
) {
  const res = await fetch(
    `${API_URL}/${mesaId}/pedido`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
      },
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

export default function MesaDetallePage() {
  const params = useParams()
  const router = useRouter()

  const mesaId =
    params.mesaId as string

  const [mesa, setMesa] =
    useState<Mesa | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [user, setUser] =
    useState<Usuario | null>(
      null
    )

  // ============================
  // Obtener usuario logueado
  // ============================
  useEffect(() => {
    const savedUser =
      localStorage.getItem(
        'user'
      )

    if (savedUser) {
      setUser(
        JSON.parse(savedUser)
      )
    }
  }, [])

  // ============================
  // Obtener mesa
  // ============================
  useEffect(() => {
    async function fetchMesa() {
      try {
        const res =
          await fetch(
            API_URL
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
  }, [mesaId])

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
        precio
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
  // Salir mesa
  // ============================
  async function handleSalir() {
    try {
      await fetch(
        `${API_URL}/${mesaId}/salir`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
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
  // Salir y pagar
  // ============================
  async function handleSalirYPagar() {
    alert(
      'Aquí luego conectaremos el pago 💳'
    )

    await handleSalir()
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

        {mesa.pedidos
          ?.length ? (
          <>
            {mesa.pedidos.map(
              (
                pedido: Pedido
              ) => (
                <div
                  key={
                    pedido.id
                  }
                >
                  {
                    pedido.producto
                  }{' '}
                  x
                  {
                    pedido.cantidad
                  }{' '}
                  — $
                  {
                    pedido.total
                  }
                </div>
              )
            )}

            <h3>
              Total: $
              {mesa.pedidos.reduce(
                (
                  total: number,
                  pedido: Pedido
                ) =>
                  total +
                  pedido.total,
                0
              )}
            </h3>
          </>
        ) : (
          <p>
            No hay
            productos
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
    </div>
  )
}