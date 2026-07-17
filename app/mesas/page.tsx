'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Mesa } from '@/types/mesas'
import { useRouter } from 'next/navigation'
import styles from './mesas.module.css'
import { useAuth } from '@/app/hooks/useAuth'
import { obtenerMesas, entrarAMesa } from '@/services/mesas'
import BackToHome from '@/app/components/BackToHome'
import MesaCard from '../components/Restaurant/MesaCard/MesaCard'

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
  if (!user) return

  obtenerMesas()
    .then(setMesas)
    .catch(console.error)
}, [user])

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
      <BackToHome />
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
      {mesas.map(mesa => (
        <MesaCard
          key={mesa.id}
          mesa={mesa}
        />
      ))}
    </div>
  )
}
