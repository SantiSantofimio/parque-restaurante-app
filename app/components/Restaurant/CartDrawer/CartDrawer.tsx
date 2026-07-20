'use client'

import {
  useEffect,
} from 'react'

import {
  useCart,
} from '@/app/components/Restaurant/CartContext/CartContext'

import styles from './CartDrawer.module.css'

interface Props {
  abierto: boolean
  confirmando?: boolean
  onCerrar: () => void
  onConfirmar: () => void
}

export default function CartDrawer({
  abierto,
  confirmando = false,
  onCerrar,
  onConfirmar,
}: Props) {
  const {
    items,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto,
    totalProductos,
    totalPrecio,
  } = useCart()

  // ============================
  // Cerrar con Escape
  // ============================

  useEffect(() => {
    if (!abierto) return

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === 'Escape') {
        onCerrar()
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [abierto, onCerrar])

  // ============================
  // No renderizar cerrado
  // ============================

  if (!abierto) {
    return null
  }

  return (
    <div
      className={styles.overlay}
      onClick={onCerrar}
      role="presentation"
    >
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={event =>
          event.stopPropagation()
        }
      >
        {/* =====================
            HEADER
        ===================== */}

        <div className={styles.header}>
          <div>
            <h2 id="cart-title">
              Tu pedido
            </h2>

            <p>
              {totalProductos}{' '}
              {totalProductos === 1
                ? 'producto'
                : 'productos'}
            </p>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onCerrar}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* =====================
            CONTENIDO
        ===================== */}

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <span>
                🛒
              </span>

              <h3>
                Tu pedido está vacío
              </h3>

              <p>
                Agrega productos del menú
                para comenzar.
              </p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className={styles.item}
              >
                {/* Información */}

                <div
                  className={
                    styles.itemInfo
                  }
                >
                  <h3>
                    {item.producto.nombre}
                  </h3>

                  <p
                    className={
                      styles.price
                    }
                  >
                    $
                    {item.producto.precio
                      .toLocaleString()}
                  </p>

                  {item.observaciones && (
                    <p
                      className={
                        styles.observations
                      }
                    >
                      📝{' '}
                      {item.observaciones}
                    </p>
                  )}
                </div>

                {/* Controles */}

                <div
                  className={
                    styles.itemActions
                  }
                >
                  <div
                    className={
                      styles.quantity
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        disminuirCantidad(
                          item.id
                        )
                      }
                      aria-label="Disminuir cantidad"
                    >
                      −
                    </button>

                    <strong>
                      {item.cantidad}
                    </strong>

                    <button
                      type="button"
                      onClick={() =>
                        aumentarCantidad(
                          item.id
                        )
                      }
                      aria-label="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>

                  <strong
                    className={
                      styles.subtotal
                    }
                  >
                    $
                    {(
                      item.producto.precio *
                      item.cantidad
                    ).toLocaleString()}
                  </strong>

                  <button
                    type="button"
                    className={
                      styles.delete
                    }
                    onClick={() =>
                      eliminarProducto(
                        item.id
                      )
                    }
                    aria-label={`Eliminar ${item.producto.nombre}`}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* =====================
            FOOTER
        ===================== */}

        {items.length > 0 && (
          <div className={styles.footer}>
            <div
              className={
                styles.totalRow
              }
            >
              <span>
                Total
              </span>

              <strong>
                $
                {totalPrecio.toLocaleString()}
              </strong>
            </div>

           <button
                type="button"
                className={
                    styles.confirmButton
                }
                onClick={
                    onConfirmar
                }
                disabled={
                    confirmando
                }
                >
                {confirmando
                    ? 'Confirmando...'
                    : 'Confirmar pedido'}
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}