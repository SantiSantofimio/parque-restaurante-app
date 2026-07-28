'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  useRouter,
} from 'next/navigation'

import {
  AdminAccessError,
  obtenerAdminStatus,
  type AdminUser,
} from '@/services/admin'

import {
  appPath,
} from '@/app/lib/paths'

export default function AdminPage() {

  const router =
    useRouter()

  const [
    user,
    setUser,
  ] =
    useState<AdminUser | null>(
      null
    )

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    forbidden,
    setForbidden,
  ] =
    useState(false)

  const [
    error,
    setError,
  ] =
    useState('')

  useEffect(() => {

    let activo = true

    async function validarAcceso() {

      try {

        const data =
          await obtenerAdminStatus()

        if (!activo) {
          return
        }

        setUser(
          data.user
        )

      } catch (error) {

        if (!activo) {
          return
        }

        if (
          error instanceof
            AdminAccessError &&
          error.status === 403
        ) {

          setForbidden(true)

          return
        }

        if (
          error instanceof
            AdminAccessError &&
          error.status === 401
        ) {
          return
        }

        setError(
          error instanceof Error
            ? error.message
            : 'Error inesperado'
        )

      } finally {

        if (activo) {
          setLoading(false)
        }

      }

    }

    void validarAcceso()

    return () => {
      activo = false
    }

  }, [])


  if (loading) {

    return (
      <main>
        <h1>
          Verificando acceso...
        </h1>
      </main>
    )

  }


  if (forbidden) {

    return (
      <main>

        <h1>
          Acceso restringido
        </h1>

        <p>
          Tu cuenta no tiene
          permisos administrativos.
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              appPath(
                '/dashboard/'
              )
            )
          }
        >
          Volver al parque
        </button>

      </main>
    )

  }


  if (error) {

    return (
      <main>

        <h1>
          No pudimos cargar
          el panel
        </h1>

        <p>
          {error}
        </p>

      </main>
    )

  }


  return (
    <main>

      <h1>
        Panel administrativo
      </h1>

      <p>
        Bienvenido,
        {' '}
        {user?.name}
      </p>

      <p>
        Rol:
        {' '}
        {user?.role}
      </p>

      <p>
        Acceso administrativo
        verificado correctamente.
      </p>

    </main>
  )
}