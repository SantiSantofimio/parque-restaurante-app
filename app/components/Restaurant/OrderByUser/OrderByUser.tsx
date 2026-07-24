'use client'

import type {
  Pedido,
} from '@/types/mesas'

import PedidoCard from '../PedidoCard/PedidoCard'

import styles from './OrderByUser.module.css'

interface Props {
  pedidos: Pedido[]
  currentUserId: number
}

interface GrupoPedidos {
  userId: number
  userName: string
  pedidos: Pedido[]
  total: number
}

export default function OrdersByUser({
  pedidos,
  currentUserId,
}: Props) {
  // ============================
  // Agrupar pedidos por usuario
  // ============================

  const grupos = pedidos.reduce<
    Record<number, GrupoPedidos>
  >(
    (acumulado, pedido) => {
      if (!acumulado[pedido.userId]) {
        acumulado[pedido.userId] = {
          userId: pedido.userId,
          userName:
            pedido.userName ||
            'Usuario',
          pedidos: [],
          total: 0,
        }
      }

      acumulado[
        pedido.userId
      ].pedidos.push(pedido)

      acumulado[
        pedido.userId
      ].total += pedido.total

      return acumulado
    },
    {}
  )

  const gruposUsuarios =
    Object.values(grupos)

  // ============================
  // Sin pedidos
  // ============================

  if (!gruposUsuarios.length) {
    return (
      <div className={styles.empty}>
        <span>🛒</span>

        <p>
          Todavía no hay pedidos
          pendientes en esta mesa.
        </p>
      </div>
    )
  }

  // ============================
  // Render
  // ============================

  return (
    <div className={styles.container}>
      {gruposUsuarios.map(grupo => {
        const esUsuarioActual =
          grupo.userId ===
          currentUserId

        return (
          <section
            key={grupo.userId}
            className={styles.group}
          >
            <div
              className={
                styles.header
              }
            >
              <div>
                <span
                  className={
                    styles.userLabel
                  }
                >
                  👤{' '}
                  {esUsuarioActual
                    ? 'Mi consumo'
                    : grupo.userName}
                </span>

                {esUsuarioActual && (
                  <small
                    className={
                      styles.you
                    }
                  >
                    {grupo.userName}
                  </small>
                )}
              </div>

              <div
                className={
                  styles.userTotal
                }
              >
                <span>
                  {grupo.pedidos.length}{' '}
                  pedido(s)
                </span>

                <strong>
                  $
                  {grupo.total
                    .toLocaleString()}
                </strong>
              </div>
            </div>

            <div
              className={
                styles.orders
              }
            >
              {grupo.pedidos.map(
                pedido => (
                  <PedidoCard
                    key={pedido.id}
                    pedido={pedido}
                  />
                )
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}