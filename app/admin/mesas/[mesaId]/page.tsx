'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  useParams,
  useRouter,
} from 'next/navigation'

import {
  obtenerMesaAdmin,
  type AdminMesa,
} from '@/app/services/adminMesas'

import styles from './detalle.module.css'


export default function AdminMesaDetallePage() {

  const params =
    useParams()

  const router =
    useRouter()

  const mesaId =
    String(
      params.mesaId
    )

  const [
    mesa,
    setMesa,
  ] = useState<AdminMesa | null>(
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


  async function cargarMesa() {

    try {

      setLoading(true)

      setError('')

      const data =
        await obtenerMesaAdmin(
          mesaId
        )

      setMesa(data)

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo cargar la mesa'
      )

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    if (!mesaId) {
      return
    }

    void cargarMesa()

  }, [mesaId])


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
          Cargando mesa...
        </h1>

        <p>
          Estamos consultando
          el estado actual.
        </p>

      </main>
    )

  }


  if (error) {

    return (
      <main
        className={
          styles.errorPage
        }
      >

        <div
          className={
            styles.errorIcon
          }
        >
          ⚠
        </div>

        <h1>
          No pudimos cargar la mesa
        </h1>

        <p>
          {error}
        </p>

        <div
          className={
            styles.errorActions
          }
        >

          <button
            type="button"
            onClick={() =>
              void cargarMesa()
            }
          >
            Reintentar
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/mesas'
              )
            }
          >
            Volver a mesas
          </button>

        </div>

      </main>
    )

  }


  if (!mesa) {
    return null
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

        <button
          type="button"
          className={
            styles.backButton
          }
          onClick={() =>
            router.push(
              '/admin/mesas'
            )
          }
        >
          ← Volver a mesas
        </button>


        <div
          className={
            styles.heading
          }
        >

          <div>

            <span
              className={
                styles.eyebrow
              }
            >
              OPERACIÓN DE MESA
            </span>

            <h1
              className={
                styles.title
              }
            >
              {mesa.id}
            </h1>

            <p
              className={
                styles.description
              }
            >
              Información actual
              de la mesa y su consumo.
            </p>

          </div>


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

      </header>


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
            Ocupación
          </span>

          <strong>
            {mesa.ocupacion}
            /
            {mesa.capacidad}
          </strong>

          <p>
            Personas presentes
          </p>

        </article>


        <article
          className={
            styles.metricCard
          }
        >

          <span>
            Pedidos
          </span>

          <strong>
            {mesa.pedidos.length}
          </strong>

          <p>
            Pedidos registrados
          </p>

        </article>


        <article
          className={
            styles.metricCard
          }
        >

          <span>
            Consumo
          </span>

          <strong>
            $
            {mesa.consumo.toLocaleString()}
          </strong>

          <p>
            Consumo actual
          </p>

        </article>

      </section>


      <div
        className={
          styles.grid
        }
      >

        <section
          className={
            styles.card
          }
        >

          <header
            className={
              styles.cardHeader
            }
          >

            <div>

              <h2>
                Clientes
              </h2>

              <p>
                Personas actualmente
                asociadas a la mesa.
              </p>

            </div>

            <span
              className={
                styles.count
              }
            >
              {mesa.usuarios.length}
            </span>

          </header>


          {mesa.usuarios.length === 0 ? (

            <div
              className={
                styles.empty
              }
            >
              No hay clientes
              en esta mesa.
            </div>

          ) : (

            <div
              className={
                styles.userList
              }
            >

              {mesa.usuarios.map(
                usuario => (

                  <article
                    key={
                      usuario.id
                    }
                    className={
                      styles.user
                    }
                  >

                    <div
                      className={
                        styles.avatar
                      }
                    >
                      {usuario.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <strong>
                        {usuario.name}
                      </strong>

                      <span>
                        Cliente
                      </span>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>


        <section
          className={
            styles.card
          }
        >

          <header
            className={
              styles.cardHeader
            }
          >

            <div>

              <h2>
                Pedidos
              </h2>

              <p>
                Consumo registrado
                en esta mesa.
              </p>

            </div>

            <span
              className={
                styles.count
              }
            >
              {mesa.pedidos.length}
            </span>

          </header>


          {mesa.pedidos.length === 0 ? (

            <div
              className={
                styles.empty
              }
            >

              <span
                className={
                  styles.emptyIcon
                }
              >
                🍽️
              </span>

              <strong>
                No hay pedidos
              </strong>

              <p>
                Actualmente no existen
                pedidos pendientes
                asociados a esta mesa.
              </p>

            </div>

          ) : (

            <div
              className={
                styles.orders
              }
            >

              {mesa.pedidos.map(
                pedido => (

                  <article
                    key={
                      pedido.id
                    }
                    className={
                      styles.order
                    }
                  >

                    <div>

                      <strong>
                        {pedido.producto}
                      </strong>

                      <span>
                        {pedido.userName}
                        {' · '}
                        x
                        {pedido.cantidad}
                      </span>

                      {pedido.observaciones && (

                        <small>
                          {pedido.observaciones}
                        </small>

                      )}

                    </div>

                    <strong>
                      $
                      {pedido.total
                        .toLocaleString()}
                    </strong>

                  </article>

                )
              )}

            </div>

          )}

        </section>

      </div>


      <section
        className={
          styles.consumption
        }
      >

        <div>

          <span>
            CONSUMO TOTAL
          </span>

          <strong>
            $
            {mesa.consumo.toLocaleString()}
          </strong>

        </div>

        <p>
          El consumo mostrado corresponde
          a los pedidos actualmente
          registrados en la mesa.
        </p>

      </section>

    </main>

  )

}