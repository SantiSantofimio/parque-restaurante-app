'use client'

import {
  useEffect,
  useState,
} from 'react'

import type {
  Pedido,
} from '@/types/mesas'

import type {
  TipoPago,
} from '@/app/services/facturas'

import styles from './PaymentModal.module.css'


interface Props {

  abierto:
    boolean

  pedidos:
    Pedido[]

  userId:
    number

  pagando?:
    boolean

  onCerrar:
    () => void

  onConfirmar:
    (
      tipoPago:
        TipoPago
    ) => void

}


export default function PaymentModal({

  abierto,

  pedidos,

  userId,

  pagando = false,

  onCerrar,

  onConfirmar,

}: Props) {


  // ============================
  // Tipo de pago seleccionado
  // ============================

  const [
    tipoPago,
    setTipoPago,
  ] = useState<TipoPago>(
    'individual'
  )


  // ============================
  // Cerrar con Escape
  // ============================

  useEffect(() => {

    if (!abierto) {
      return
    }


    function handleKeyDown(
      event:
        KeyboardEvent
    ) {

      if (
        event.key ===
        'Escape' &&
        !pagando
      ) {

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

  }, [
    abierto,
    pagando,
    onCerrar,
  ])


  // ============================
  // No renderizar cerrado
  // ============================

  if (!abierto) {
    return null
  }


  // ============================
  // Pedidos del usuario
  // ============================

  const misPedidos =
    pedidos.filter(
      pedido =>
        pedido.userId ===
        userId
    )


  // ============================
  // Total individual
  // ============================

  const totalIndividual =
    misPedidos.reduce(
      (
        acumulado,
        pedido
      ) =>
        acumulado +
        pedido.total,
      0
    )


  // ============================
  // Total mesa
  // ============================

  const totalMesa =
    pedidos.reduce(
      (
        acumulado,
        pedido
      ) =>
        acumulado +
        pedido.total,
      0
    )


  // ============================
  // Total seleccionado
  // ============================

  const totalSeleccionado =

    tipoPago ===
    'individual'

      ? totalIndividual

      : totalMesa


  // ============================
  // Confirmar
  // ============================

  function handleConfirmar() {

    if (
      pagando ||
      totalSeleccionado <= 0
    ) {
      return
    }


    onConfirmar(
      tipoPago
    )

  }


  return (

    <div
      className={
        styles.overlay
      }

      onClick={() => {

        if (!pagando) {
          onCerrar()
        }

      }}

      role="presentation"
    >

      <div
        className={
          styles.modal
        }

        role="dialog"

        aria-modal="true"

        aria-labelledby=
          "payment-modal-title"

        onClick={
          event =>
            event.stopPropagation()
        }
      >


        {/* ======================
            HEADER
        ====================== */}

        <div
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
              💳 Pago seguro
            </span>

            <h2
              id=
                "payment-modal-title"
            >
              Pagar cuenta
            </h2>

            <p>
              Selecciona cómo quieres
              pagar los pedidos pendientes.
            </p>

          </div>


          <button

            type="button"

            className={
              styles.close
            }

            onClick={
              onCerrar
            }

            disabled={
              pagando
            }

            aria-label=
              "Cerrar ventana de pago"

          >
            ✕
          </button>

        </div>


        {/* ======================
            PAGO INDIVIDUAL
        ====================== */}

        <button

          type="button"

          className={`
            ${styles.option}

            ${
              tipoPago ===
              'individual'

                ? styles.selected

                : ''
            }
          `}

          onClick={() =>
            setTipoPago(
              'individual'
            )
          }

          disabled={
            pagando
          }

        >

          <div
            className={
              styles.optionIcon
            }
          >
            👤
          </div>


          <div
            className={
              styles.optionContent
            }
          >

            <strong>
              Pagar mi consumo
            </strong>

            <span>
              {
                misPedidos.length
              } pedido(s)
            </span>

          </div>


          <strong
            className={
              styles.optionPrice
            }
          >

            $
            {totalIndividual
              .toLocaleString()}

          </strong>

        </button>


        {/* ======================
            PAGO TODA LA MESA
        ====================== */}

        <button

          type="button"

          className={`
            ${styles.option}

            ${
              tipoPago ===
              'mesa'

                ? styles.selected

                : ''
            }
          `}

          onClick={() =>
            setTipoPago(
              'mesa'
            )
          }

          disabled={
            pagando
          }

        >

          <div
            className={
              styles.optionIcon
            }
          >
            👥
          </div>


          <div
            className={
              styles.optionContent
            }
          >

            <strong>
              Pagar toda la mesa
            </strong>

            <span>
              {
                pedidos.length
              } pedido(s)
            </span>

          </div>


          <strong
            className={
              styles.optionPrice
            }
          >

            $
            {totalMesa
              .toLocaleString()}

          </strong>

        </button>


        {/* ======================
            RESUMEN
        ====================== */}

        <div
          className={
            styles.summary
          }
        >

          <span>
            Total a pagar
          </span>

          <strong>

            $

            {totalSeleccionado
              .toLocaleString()}

          </strong>

        </div>


        {/* ======================
            SIN PEDIDOS PROPIOS
        ====================== */}

        {
          tipoPago ===
            'individual' &&
          totalIndividual === 0 && (

            <p
              className={
                styles.warning
              }
            >

              No tienes pedidos
              pendientes asociados
              a tu usuario.

            </p>

          )
        }


        {/* ======================
            CONFIRMAR
        ====================== */}

        <button

          type="button"

          className={
            styles.confirmButton
          }

          onClick={
            handleConfirmar
          }

          disabled={
            pagando ||
            totalSeleccionado <= 0
          }

        >

          {
            pagando

              ? 'Procesando pago...'

              : `Pagar $${totalSeleccionado.toLocaleString()}`
          }

        </button>


        <small
          className={
            styles.disclaimer
          }
        >

          Esta versión utiliza un
          pago simulado. No se
          solicitarán datos bancarios.

        </small>

      </div>

    </div>

  )

}