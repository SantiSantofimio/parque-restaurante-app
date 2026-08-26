'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  obtenerMesasAdmin,
  type AdminMesa,
  type AdminMesasResumen,
} from '@/app/services/adminMesas'

import styles from './mesas.module.css'


export default function AdminMesasPage() {

  const [
    mesas,
    setMesas,
  ] = useState<AdminMesa[]>([])

  const [
    resumen,
    setResumen,
  ] = useState<AdminMesasResumen | null>(
    null
  )

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')


  async function cargarMesas() {

    try {

      setLoading(true)

      setError('')

      const data =
        await obtenerMesasAdmin()

      setMesas(
        data.mesas
      )

      setResumen(
        data.resumen
      )

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las mesas'
      )

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    void cargarMesas()

  }, [])


  if (loading) {

    return (
      <main
        className={
          styles.loading
        }
      >

        <div
          className={
            styles.loadingIndicator
          }
        />

        <h1>
          Cargando mesas...
        </h1>

        <p>
          Estamos consultando
          el estado actual del parque.
        </p>

      </main>
    )

  }


  return (

    <main
      className={
        styles.page
      }
    >

      <header
        className={
          styles.header
        }
      >

        <div>

          <span
            className={
              styles.eyebrow
            }
          >
            OPERACIÓN
          </span>

          <h1
            className={
              styles.title
            }
          >
            Mesas y pedidos
          </h1>

          <p
            className={
              styles.description
            }
          >
            Controla la ocupación,
            los clientes presentes
            y el consumo de cada mesa.
          </p>

        </div>

        <button
          type="button"
          className={
            styles.refreshButton
          }
          onClick={() =>
            void cargarMesas()
          }
        >
          Actualizar
        </button>

      </header>


      {error && (

        <div
          className={
            styles.error
          }
        >

          <strong>
            No pudimos cargar las mesas
          </strong>

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              void cargarMesas()
            }
          >
            Reintentar
          </button>

        </div>

      )}


      {resumen && (

        <section
          className={
            styles.metrics
          }
        >

          <article
            className={
              styles.metricCard
            }
          >

            <span>
              Mesas totales
            </span>

            <strong>
              {resumen.total}
            </strong>

          </article>


          <article
            className={
              styles.metricCard
            }
          >

            <span>
              Ocupadas
            </span>

            <strong>
              {resumen.ocupadas}
            </strong>

          </article>


          <article
            className={
              styles.metricCard
            }
          >

            <span>
              Disponibles
            </span>

            <strong>
              {resumen.disponibles}
            </strong>

          </article>


          <article
            className={
              styles.metricCard
            }
          >

            <span>
              Pedidos activos
            </span>

            <strong>
              {resumen.pedidosActivos}
            </strong>

          </article>


          <article
            className={
              styles.metricCard
            }
          >

            <span>
              Consumo activo
            </span>

            <strong>
              $
              {resumen.consumoActivo
                .toLocaleString()}
            </strong>

          </article>

        </section>

      )}


      <section
        className={
          styles.section
        }
      >

        <div
          className={
            styles.sectionHeader
          }
        >

          <div>

            <h2>
              Estado de las mesas
            </h2>

            <p>
              Situación actual de cada mesa
              del establecimiento.
            </p>

          </div>

          <span
            className={
              styles.countBadge
            }
          >
            {mesas.length}
          </span>

        </div>


        {mesas.length === 0 ? (

          <div
            className={
              styles.empty
            }
          >

            <div
              className={
                styles.emptyIcon
              }
            >
              🪑
            </div>

            <h3>
              No hay mesas registradas
            </h3>

            <p>
              No existen mesas disponibles
              para mostrar en este momento.
            </p>

          </div>

        ) : (

          <div
            className={
              styles.tableList
            }
          >

            {mesas.map(
              mesa => (

                <article
                  key={
                    mesa.id
                  }
                  className={
                    styles.mesaCard
                  }
                >

                  <div
                    className={
                      styles.mesaIdentity
                    }
                  >

                    <div
                      className={
                        styles.mesaIcon
                      }
                    >
                      🪑
                    </div>

                    <div>

                      <h3>
                        {mesa.id}
                      </h3>

                      <span>
                        Capacidad:
                        {' '}
                        {mesa.capacidad}
                        {' '}
                        personas
                      </span>

                    </div>

                  </div>


                  <div
                    className={
                      styles.mesaStatus
                    }
                  >

                    <span
                      className={
                        mesa.ocupada
                          ? styles.statusOccupied
                          : styles.statusAvailable
                      }
                    >

                      <span
                        className={
                          styles.statusDot
                        }
                      />

                      {mesa.ocupada
                        ? 'Ocupada'
                        : 'Disponible'}

                    </span>

                  </div>


                  <div
                    className={
                      styles.mesaInfo
                    }
                  >

                    <span>
                      Ocupación
                    </span>

                    <strong>
                      {mesa.ocupacion}
                      /
                      {mesa.capacidad}
                    </strong>

                  </div>


                  <div
                    className={
                      styles.mesaInfo
                    }
                  >

                    <span>
                      Pedidos
                    </span>

                    <strong>
                      {mesa.pedidos.length}
                    </strong>

                  </div>


                  <div
                    className={
                      styles.mesaInfo
                    }
                  >

                    <span>
                      Consumo
                    </span>

                    <strong>
                      $
                      {mesa.consumo
                        .toLocaleString()}
                    </strong>

                  </div>


                  <div
                    className={
                      styles.users
                    }
                  >

                    <span
                      className={
                        styles.usersLabel
                      }
                    >
                      Clientes
                    </span>

                    {mesa.usuarios.length === 0 ? (

                      <span
                        className={
                          styles.noUsers
                        }
                      >
                        Mesa libre
                      </span>

                    ) : (

                      <div
                        className={
                          styles.userList
                        }
                      >

                        {mesa.usuarios.map(
                          (
                          usuario: {
                            id: number | string
                            name: string
                          }) => (

                            <span
                              key={
                                usuario.id
                              }
                              className={
                                styles.user
                              }
                            >
                              {usuario.name}
                            </span>

                          )
                        )}

                      </div>

                    )}

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