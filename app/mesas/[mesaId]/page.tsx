'use client'

import { use, useEffect, useState } from 'react'
import {
  useParams,
  useRouter,
} from 'next/navigation'
import type {
  Mesa,
  Usuario,
} from '@/types/mesas'
import styles from './mesa.module.css'

const API_URL =
  'http://localhost:4000/api/mesas'

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
    useState<Usuario | null>(null)



  // ============================
  // Obtener mesa
  // ============================
  useEffect(() => {
    async function fetchMesa() {
      try {
        const res = await fetch(
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
              m.id === mesaId
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
  }, [mesaId])

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
          body: JSON.stringify({
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
      <h1>Cargando mesa...</h1>
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

        <ul
          className={
            styles.menuList
          }
        >
          <li>
            🍔 Hamburguesa —
            $25.000
          </li>

          <li>
            🍕 Pizza —
            $38.000
          </li>

          <li>
            🥤 Gaseosa —
            $6.000
          </li>
        </ul>

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