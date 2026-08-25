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
  obtenerAdminDashboard,
  obtenerAdminStatus,
  type AdminDashboardResponse,
  type AdminUser,
} from '@/app/services/admin'

import {
  appPath,
} from '@/app/lib/paths'

import AdminSidebar from '@/app/components/admin/AdminSidebar/AdminSidebar'
import AdminHeader from '@/app/components/admin/AdminHeader/AdminHeader'
import styles from './admin.module.css'

export default function AdminPage() {

  const router =
    useRouter()

  const [ 
    user,
    setUser, 
  ] = useState<AdminUser | null>()

  const [
    dashboard,
    setDashboard
  ] = useState<AdminDashboardResponse | null>(null)

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [ forbidden, setForbidden, ] = useState(false)

  const [ error,setError, ] = useState('')

  useEffect(() => {

    let activo = true

    async function validarAcceso() {

      try {

        const [
          statusData,
          dashboardData,
        ] =
          await Promise.all([
            obtenerAdminStatus(),
            obtenerAdminDashboard(),
          ])

          if (!activo) return

          setUser(statusData.user)
          setDashboard(dashboardData)

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

  if ( 
    !user ||
    !dashboard
  ) {
    return null
  }


    return (
        <div
            className={
            styles.admin
            }
        >

            <AdminSidebar />

            <section
            className={
                styles.workspace
            }
            >

            <AdminHeader
                user={user}
            />

            <main
                className={
                styles.content
                }
            >

                <div
                className={
                    styles.welcome
                }
                >
                <div>
                    <span>
                    RESUMEN GENERAL
                    </span>

                    <h2>
                    Buenos días,
                    {' '}
                    {user.name}
                    </h2>

                    <p>
                    Aquí podrás controlar
                    la operación del Parque
                    Turístico Yuma.
                    </p>
                </div>
                </div>

                <div
                  className={
                    styles.metricsGrid
                  }
                >
                  <article
                    className={
                    styles.metricCard
                  }>
                    <span>
                    👥 Clientes
                    </span>

                  <strong>
                    {dashboard.clientes.total}
                  </strong>
                  
                  <p>
                    Clientes registrados
                  </p>
                  </article>

                  <article
                    className={
                      styles.metricCard
                    }>
                    
                    <span>
                      🪑 Mesas
                    </span>

                    <strong>
                      {dashboard.mesas.ocupadas}
                      /
                      {dashboard.mesas.total}
                    </strong>

                    <p>
                      Mesas ocupadas
                    </p>

                  </article>

                  <article
                    className={
                      styles.metricCard
                    }
                  >
                    <span>
                      🍽️ Pedidos
                    </span>

                    <strong>
                      {dashboard.pedidos.activos}
                    </strong>

                    <p>
                      Pedidos activos
                    </p>

                  </article>

                  <article
                    className={
                      styles.metricCard
                    }
                  >
                    <span>
                    💰 Ingresos
                  </span>

                  <strong>
                    $
                    {dashboard.facturacion.ingresos
                      .toLocaleString()}
                  </strong>

                  <p>
                    {
                      dashboard.facturacion.facturas
                    } facturas pagadas
                  </p>

                  </article>
                  
                </div>

            </main>

            </section>

        </div>
    )
}