'use client'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useRouter,
} from 'next/navigation'

import type {
  Mesa,
} from '@/types/mesas'

import {
  obtenerMesas,
  entrarAMesa,
} from '@/services/mesas'

import {
  useAuth,
} from '@/app/hooks/useAuth'

import BackToHome from '@/app/components/BackToHome'

import MesaCard from '@/app/components/Restaurant/MesaCard/MesaCard'

import styles from './mesas.module.css'


export default function MesasPage() {
  const router =
    useRouter()

  const {
    user,
    loading: authLoading,
  } = useAuth()

  const [
    mesas,
    setMesas,
  ] = useState<Mesa[]>([])

  const [
    cargandoMesas,
    setCargandoMesas,
  ] = useState(true)

  const [
    entrandoMesaId,
    setEntrandoMesaId,
  ] = useState<string | null>(
    null
  )

  const [
    error,
    setError,
  ] = useState('')


  // ============================
  // Proteger página
  // ============================
  useEffect(() => {
    if (
      !authLoading &&
      !user
    ) {
      router.push(
        '/auth/login'
      )
    }
  }, [
    user,
    authLoading,
    router,
  ])


  // ============================
  // Cargar mesas
  // ============================
  useEffect(() => {
    if (!user) {
      return
    }

    async function cargarMesas() {
      try {
        setCargandoMesas(true)
        setError('')

        const data =
          await obtenerMesas()

        setMesas(data)
      } catch (error) {
        console.error(
          'Error cargando mesas:',
          error
        )

        if (
          error instanceof Error
        ) {
          setError(
            error.message
          )
        } else {
          setError(
            'No se pudieron cargar las mesas'
          )
        }
      } finally {
        setCargandoMesas(false)
      }
    }

    void cargarMesas()
  }, [user])


  // ============================
  // Encontrar mesa actual
  // ============================
  const mesaActualId =
    useMemo(() => {
      if (!user) {
        return null
      }

      const mesaActual =
        mesas.find(
          mesa =>
            mesa.usuarios.some(
              usuario =>
                usuario.id ===
                user.id
            )
        )

      return (
        mesaActual?.id ??
        null
      )
    }, [
      mesas,
      user,
    ])


  // ============================
  // Entrar a mesa
  // ============================
  async function handleEntrar(
    mesaId: string
  ) {
    if (
      !user ||
      entrandoMesaId
    ) {
      return
    }

    try {
      setEntrandoMesaId(
        mesaId
      )

      setError('')

      const {
        mesa,
      } =
        await entrarAMesa(
          mesaId
        )


      // ========================
      // Actualizar solamente
      // la mesa modificada
      // ========================
      setMesas(
        prev =>
          prev.map(
            item =>
              item.id ===
              mesa.id
                ? mesa
                : item
          )
      )


      // ========================
      // Entrar directamente
      // al detalle de la mesa
      // ========================
      router.push(
        `/mesas/${mesa.id}`
      )

    } catch (error) {
      console.error(
        'Error entrando a mesa:',
        error
      )

      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo entrar a la mesa'

      setError(message)

      alert(message)

    } finally {
      setEntrandoMesaId(
        null
      )
    }
  }


  // ============================
  // Loading autenticación
  // ============================
  if (authLoading) {
    return (
      <div className={styles.container}>
        <p>
          Cargando usuario...
        </p>
      </div>
    )
  }


  // ============================
  // Loading mesas
  // ============================
  if (cargandoMesas) {
    return (
      <div className={styles.container}>
        <BackToHome />

        <h1 className={styles.title}>
          Mesas
        </h1>

        <p>
          Cargando mesas...
        </p>
      </div>
    )
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

      <p>
        Selecciona una mesa
        disponible o únete a
        una que tenga espacio.
      </p>


      {/* ======================
          ERROR
      ====================== */}

      {error && (
        <p>
          ⚠️ {error}
        </p>
      )}


      {/* ======================
          MESA ACTUAL
      ====================== */}

      {mesaActualId && (
        <div
          className={
            styles.currentMesa
          }
        >
          <span>
            Estás en la mesa{' '}

            <strong>
              {mesaActualId}
            </strong>
          </span>

          <button
            type="button"
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


      {/* ======================
          LISTADO DE MESAS
      ====================== */}

      <div className={styles.grid}>
        {mesas.map(mesa => {
          const estoyAqui =
            mesa.id ===
            mesaActualId

          const tengoOtraMesa =
            Boolean(
              mesaActualId &&
              !estoyAqui
            )

          return (
            <MesaCard
              key={mesa.id}

              mesa={mesa}

              estoyAqui={
                estoyAqui
              }

              tengoOtraMesa={
                tengoOtraMesa
              }

              onEntrar={() =>
                handleEntrar(
                  mesa.id
                )
              }

              onIrAMesa={() =>
                router.push(
                  `/mesas/${mesa.id}`
                )
              }
            />
          )
        })}
      </div>


      {/* ======================
          ESTADO DE ENTRADA
      ====================== */}

      {entrandoMesaId && (
        <p>
          Entrando a{' '}
          {entrandoMesaId}...
        </p>
      )}


      {/* ======================
          SIN MESAS
      ====================== */}

      {!mesas.length && (
        <p>
          No hay mesas
          disponibles actualmente.
        </p>
      )}
    </div>
  )
}