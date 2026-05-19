'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Mesa, Usuario } from '@/types/mesas'
import { useRouter } from 'next/navigation'
import styles from './mesas.module.css'
import { useAuth } from '@/app/hooks/useAuth'

const API_URL = 'http://localhost:4000/api/mesas'

// ============================
// API
// ============================
export async function obtenerMesas(): Promise<Mesa[]> {
  const res = await fetch(API_URL)

  if (!res.ok) {
    throw new Error('Error al obtener mesas')
  }

  return res.json()
}

export async function entrarAMesa(
  mesaId: string,
  user: Usuario
): Promise<{ mesa: Mesa }> {
  const res = await fetch(
    `${API_URL}/${mesaId}/entrar`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    }
  )

  if (!res.ok) {
    throw new Error(
      'Error al entrar a la mesa'
    )
  }

  return res.json()
}

// ============================
// Página
// ============================
export default function MesasPage() {
  const router = useRouter()
  const [mesas, setMesas] = useState<Mesa[]>([])
  const { user, loading: authLoading } = useAuth()

  // ============================
  // Obtener usuario logueado
  // ============================
  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/auth/login")
    } 
  }, [user, router, authLoading])

  // ============================
  // Cargar mesas
  // ============================
  useEffect(() => {
    obtenerMesas()
      .then(setMesas)
      .catch(console.error)
  }, [])

  // ============================
  // Mesa actual
  // ============================
  const mesaActualId = useMemo(() => {
    if (!user) return null

    const mesa = mesas.find(m =>
      m.usuarios.some(
        u => u.id === user.id
      )
    )

    return mesa?.id ?? null
  }, [mesas, user])

  // ============================
  // Esperar autenticación
  // ============================
  if (authLoading) {
    return (
      <h1>
        Cargando usuario...
      </h1>
    )
  }

  // ============================
  // Entrar a una mesa
  // ============================
  async function handleEntrar(
    mesaId: string
  ) {
    try {
      if (!user) return

      const { mesa } =
        await entrarAMesa(
        mesaId,
        user
        )

      setMesas(prev =>
        prev.map(m => {
        const usuariosLimpios =
        m.usuarios.filter(
          u =>
            u.id !== user.id
        )

        if (m.id === mesaId) {
          return mesa
        }

        return {
          ...m,
          usuarios:
          usuariosLimpios,
        }
      })
      )
    } catch (error) {
      console.error(error)
      alert(
        'No se pudo entrar a la mesa'
      )
    }
  }

  // ============================
  // Render
  // ============================
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Mesas
      </h1>

      {/* Mesa actual */}
      {mesaActualId && (
        <div className={styles.currentMesa}>
          <span>
            Estás en la mesa{' '}
            <strong>
              {mesaActualId}
            </strong>
          </span>

          <button
            className={
              styles.buttonPrimary
            }
            onClick={() =>
              router.push(
                `/mesas/${mesaActualId}`
              )
            }
          >
            Ir a mi mesa
          </button>
        </div>
      )}

      {/* Listado mesas */}
      <div className={styles.grid}>
        {mesas.map((m) => {
          const estoyAqui =
            m.id === mesaActualId

          return (
            <div
              key={m.id}
              className={`${styles.card} ${
                mesaActualId &&
                !estoyAqui
                  ? styles.disabled
                  : ''
              }`}
            >
              <h3>{m.id}</h3>

              <p>
                Capacidad:{' '}
                {m.capacidad}
              </p>

              <p>
                Estado:{' '}
                {m.ocupada
                  ? 'Ocupada'
                  : 'Libre'}
              </p>

              {estoyAqui && (
                <p>
                  👤 Tú estás aquí
                </p>
              )}

              {!mesaActualId &&
                !m.ocupada && (
                  <button
                    className={
                      styles.buttonPrimary
                    }
                    onClick={() =>
                      handleEntrar(
                        m.id
                      )
                    }
                  >
                    Entrar
                  </button>
                )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
