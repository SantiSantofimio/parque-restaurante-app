'use client'

import type {
  AdminMenuProduct,
} from '@/app/services/adminMenu'

import styles from './ProductCard.module.css'


type ProductCardProps = {

  producto:
    AdminMenuProduct

  onEditar:
    (
      producto:
        AdminMenuProduct
    ) => void

  onCambiarDisponibilidad:
    (
      producto:
        AdminMenuProduct
    ) => void

}


function obtenerIniciales(
  nombre:
    string
) {

  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(
      palabra =>
        palabra
          .charAt(0)
          .toUpperCase()
    )
    .join('')

}


function formatearPrecio(
  precio:
    number
) {

  return new Intl.NumberFormat(
    'es-CO',
    {
      style:
        'currency',

      currency:
        'COP',

      maximumFractionDigits:
        0,
    }
  ).format(
    precio
  )

}


export default function ProductCard({
  producto,
  onEditar,
  onCambiarDisponibilidad,
}: ProductCardProps) {

  return (

    <article
      className={
        styles.card
      }
    >

      <div
        className={
          styles.productInfo
        }
      >

        <div
          className={
            styles.avatar
          }
        >

          {
            obtenerIniciales(
              producto.nombre
            )
          }

        </div>


        <div
          className={
            styles.identity
          }
        >

          <strong
            className={
              styles.name
            }
          >

            {
              producto.nombre
            }

          </strong>


          <span
            className={
              styles.category
            }
          >

            {
              producto.categoria
            }

          </span>


          <p
            className={
              styles.description
            }
          >

            {
              producto.descripcion
            }

          </p>

        </div>

      </div>


      <div
        className={
          styles.price
        }
      >

        {
          formatearPrecio(
            producto.precio
          )
        }

      </div>


      <div
        className={
          styles.status
        }
      >

        <span
          className={
            producto.disponible
              ? styles.statusActive
              : styles.statusInactive
          }
        >

          <span
            className={
              styles.statusDot
            }
          />

          {
            producto.disponible
              ? 'Disponible'
              : 'Agotado'
          }

        </span>

      </div>


      <div
        className={
          styles.actions
        }
      >

        <button
          type="button"
          className={
            styles.editButton
          }
          onClick={() =>
            onEditar(
              producto
            )
          }
        >
          Editar
        </button>


        <button
          type="button"
          className={
            producto.disponible
              ? styles.disableButton
              : styles.enableButton
          }
          onClick={() =>
            onCambiarDisponibilidad(
              producto
            )
          }
        >

          {
            producto.disponible
              ? 'Desactivar'
              : 'Activar'
          }

        </button>

      </div>

    </article>

  )

}