'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  obtenerUsuariosAdmin,
  cambiarRolUsuario,
  cambiarEstadoUsuario,
  type AdminUser,
} from '@/services/adminUsers'

import styles from './clientes.module.css'

export default function AdminClientesPage() {

  const [
    users,
    setUsers,
  ] = useState<AdminUser[]>([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  async function cargarUsuarios() {

    try {

      setLoading(true)

      setError('')

      const data =
        await obtenerUsuariosAdmin()

      setUsers(data)

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los clientes'
      )

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    void cargarUsuarios()

  }, [])


  async function handleEstado(
    user: AdminUser
  ) {

    try {

      setError('')

      const resultado =
        await cambiarEstadoUsuario(
          user.id,
          !user.active
        )

      setUsers(
        current =>
          current.map(
            item =>
              String(item.id) ===
              String(user.id)
                ? resultado.user
                : item
          )
      )

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el estado del cliente'
      )

    }

  }


  async function handleRol(
    user: AdminUser,
    role: string
  ) {

    if (
      role === user.role
    ) {
      return
    }

    try {

      setError('')

      const resultado =
        await cambiarRolUsuario(
          user.id,
          role
        )

      setUsers(
        current =>
          current.map(
            item =>
              String(item.id) ===
              String(user.id)
                ? resultado.user
                : item
          )
      )

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el rol del cliente'
      )

    }

  }


  if (loading) {

    return (
      <main
        className={styles.page}
      >

        <section
          className={styles.loading}
        >

          <div
            className={styles.loadingIndicator}
          />

          <h1>
            Cargando clientes...
          </h1>

          <p>
            Estamos preparando la información
            del panel administrativo.
          </p>

        </section>

      </main>
    )

  }


  return (

    <main
      className={styles.page}
    >

      {/* ============================
          CABECERA
      ============================ */}

      <header
        className={styles.header}
      >

        <div>

          <span
            className={styles.eyebrow}
          >
            ADMINISTRACIÓN
          </span>

          <h1
            className={styles.title}
          >
            Clientes
          </h1>

          <p
            className={styles.description}
          >
            Consulta y gestiona las cuentas
            registradas en el Parque Turístico Yuma.
          </p>

        </div>

        <div
          className={styles.summary}
        >

          <strong>
            {users.length}
          </strong>

          <span>
            cuentas registradas
          </span>

        </div>

      </header>


      {/* ============================
          ERROR
      ============================ */}

      {error && (

        <div
          className={styles.error}
          role="alert"
        >

          <strong>
            No pudimos completar la operación
          </strong>

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError('')
            }
          >
            Cerrar
          </button>

        </div>

      )}


      {/* ============================
          LISTADO
      ============================ */}

      <section
        className={styles.section}
      >

        <div
          className={styles.sectionHeader}
        >

          <div>

            <h2>
              Cuentas registradas
            </h2>

            <p>
              Administra el acceso y el rango
              de cada cuenta.
            </p>

          </div>

          <span
            className={styles.countBadge}
          >
            {users.length}
          </span>

        </div>


        {users.length === 0 ? (

          <div
            className={styles.empty}
          >

            <div
              className={styles.emptyIcon}
            >
              👥
            </div>

            <h3>
              No hay clientes registrados
            </h3>

            <p>
              Cuando existan cuentas registradas
              aparecerán aquí.
            </p>

          </div>

        ) : (

          <div
            className={styles.list}
          >

            {users.map(
              user => (

                <article
                  key={user.id}
                  className={styles.userCard}
                >

                  {/* ======================
                      INFORMACIÓN
                  ====================== */}

                  <div
                    className={styles.userInfo}
                  >

                    <div
                      className={styles.avatar}
                    >
                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase() || '?'}
                    </div>

                    <div
                      className={styles.identity}
                    >

                      <strong
                        className={styles.userName}
                      >
                        {user.name}
                      </strong>

                      <span
                        className={styles.userEmail}
                      >
                        {user.email}
                      </span>

                    </div>

                  </div>


                  {/* ======================
                      ESTADO Y ROL
                  ====================== */}

                  <div
                    className={styles.userMeta}
                  >

                    <div
                      className={styles.metaGroup}
                    >

                      <span
                        className={styles.metaLabel}
                      >
                        Rango
                      </span>

                      <select
                        className={styles.roleSelect}
                        value={
                          user.role
                        }
                        onChange={event =>
                          void handleRol(
                            user,
                            event.target.value
                          )
                        }
                      >

                        <option value="customer">
                          Customer
                        </option>

                        <option value="employee">
                          Employee
                        </option>

                        <option value="manager">
                          Manager
                        </option>

                        <option value="admin">
                          Admin
                        </option>

                        <option value="superadmin">
                          Superadmin
                        </option>

                      </select>

                    </div>


                    <div
                      className={styles.metaGroup}
                    >

                      <span
                        className={styles.metaLabel}
                      >
                        Estado
                      </span>

                      <span
                        className={`
                          ${styles.status}
                          ${
                            user.active
                              ? styles.statusActive
                              : styles.statusInactive
                          }
                        `}
                      >

                        <span
                          className={styles.statusDot}
                        />

                        {user.active
                          ? 'Activo'
                          : 'Inactivo'}

                      </span>

                    </div>

                  </div>


                  {/* ======================
                      ACCIÓN
                  ====================== */}

                  <div
                    className={styles.actions}
                  >

                    <button
                      type="button"
                      className={`
                        ${styles.statusButton}
                        ${
                          user.active
                            ? styles.deactivateButton
                            : styles.activateButton
                        }
                      `}
                      onClick={() =>
                        void handleEstado(
                          user
                        )
                      }
                    >

                      {user.active
                        ? 'Desactivar'
                        : 'Activar'}

                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>

    </main>

  )

}