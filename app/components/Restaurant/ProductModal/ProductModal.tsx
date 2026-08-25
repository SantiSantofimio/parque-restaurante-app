'use client'

import {
  useEffect,
  useState,
} from 'react'

import type {
  MenuItem,
} from '@/app/services/menu'

import styles from './ProductModal.module.css'

// ============================
// Tipo de producto seleccionado
// que enviaremos al carrito
// ============================

export interface ProductSelection {
  producto: MenuItem
  cantidad: number
  observaciones: string
}

// ============================
// Props
// ============================

interface Props {
  producto: MenuItem | null
  onCerrar: () => void
  onAgregar: (
    seleccion: ProductSelection
  ) => void
}

// ============================
// Componente
// ============================

export default function ProductModal({
  producto,
  onCerrar,
  onAgregar,
}: Props) {
  const [cantidad, setCantidad] =
    useState(1)

  const [
    observaciones,
    setObservaciones,
  ] = useState('')

  // ============================
  // Cerrar y limpiar modal
  // ============================

  function handleCerrar() {
    setCantidad(1)
    setObservaciones('')
    onCerrar()
  }

  // ============================
  // Cerrar con Escape
  // ============================

  useEffect(() => {
    if (!producto) return

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === 'Escape') {
        handleCerrar()
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
  }, [producto])

  // ============================
  // No renderizar si no existe
  // producto seleccionado
  // ============================

  if (!producto) {
    return null
  }

  // A partir de aquí TypeScript
  // sabe que producto existe.

  const total =
    producto.precio * cantidad

  // ============================
  // Cantidad
  // ============================

  function disminuirCantidad() {
    setCantidad(prev =>
      Math.max(1, prev - 1)
    )
  }

  function aumentarCantidad() {
    setCantidad(prev =>
      prev + 1
    )
  }

  // ============================
  // Agregar al carrito
  // ============================

  function handleAgregar() {
    /*
      Esta comprobación es importante.

      Aunque arriba ya verificamos producto,
      esta función puede ejecutarse después
      y TypeScript conserva el tipo original:
      MenuItem | null.

      Por eso verificamos nuevamente.
    */

    if (!producto) return

    const seleccion: ProductSelection = {
      producto,
      cantidad,
      observaciones:
        observaciones.trim(),
    }

    onAgregar(seleccion)

    handleCerrar()
  }

  // ============================
  // Render
  // ============================

  return (
    <div
      className={styles.overlay}
      onClick={handleCerrar}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={event =>
          event.stopPropagation()
        }
      >
        {/* Cerrar */}

        <button
          type="button"
          className={styles.close}
          onClick={handleCerrar}
          aria-label="Cerrar producto"
        >
          ✕
        </button>

        {/* Imagen */}

        {producto.imagen && (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className={styles.image}
          />
        )}

        <div className={styles.content}>

          {/* Categoría */}

          <span
            className={
              styles.category
            }
          >
            {producto.categoria}
          </span>

          {/* Nombre */}

          <h2
            id="product-modal-title"
            className={styles.title}
          >
            {producto.nombre}
          </h2>

          {/* Descripción */}

          <p
            className={
              styles.description
            }
          >
            {producto.descripcion}
          </p>

          {/* Precio */}

          <strong
            className={styles.price}
          >
            $
            {producto.precio
              .toLocaleString()}
          </strong>

          {/* Cantidad */}

          <div
            className={
              styles.quantitySection
            }
          >
            <span>
              Cantidad
            </span>

            <div
              className={
                styles.quantity
              }
            >
              <button
                type="button"
                onClick={
                  disminuirCantidad
                }
                disabled={
                  cantidad === 1
                }
                aria-label="Disminuir cantidad"
              >
                −
              </button>

              <strong>
                {cantidad}
              </strong>

              <button
                type="button"
                onClick={
                  aumentarCantidad
                }
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
          </div>

          {/* Observaciones */}

          <div
            className={styles.field}
          >
            <label
              htmlFor="observaciones"
            >
              ¿Alguna observación?
            </label>

            <textarea
              id="observaciones"
              value={observaciones}
              onChange={event =>
                setObservaciones(
                  event.target.value
                )
              }
              placeholder="Ej: sin cebolla, salsa aparte..."
              maxLength={250}
            />

            <small>
              {observaciones.length}
              /250
            </small>
          </div>

          {/* Agregar */}

          <button
            type="button"
            className={
              styles.addButton
            }
            onClick={
              handleAgregar
            }
          >
            <span>
              Agregar {cantidad}
            </span>

            <strong>
              $
              {total.toLocaleString()}
            </strong>
          </button>

        </div>
      </div>
    </div>
  )
}