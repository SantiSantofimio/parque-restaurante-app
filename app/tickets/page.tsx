'use client'

import { useMemo, useState } from 'react'
import { comprarTicket } from '@/services/tickets'
import styles from './tickets.module.css'

export default function TicketsPage() {
  const [tipo, setTipo] = useState<'adulto' | 'infantil'>('adulto')
  const [cantidad, setCantidad] = useState(1)
  const [comprando, setComprando] = useState(false)

  const precio = tipo === 'adulto' ? 20000 : 12000

  const total = useMemo(
    () => precio * cantidad,
    [precio, cantidad]
  )

  const puntos = useMemo(
    () => Math.floor(total / 1000),
    [total]
  )

  async function handleComprar() {
    try {
      setComprando(true)

      await comprarTicket(tipo, cantidad)

      alert(`Compra realizada. Ganaste ${puntos} puntos ⭐`)
    } catch (error) {
      console.error(error)
      alert('No se pudo completar la compra')
    } finally {
      setComprando(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          🏊 Comprar entradas
        </h1>

        <div className={styles.field}>
          <label htmlFor="tipoEntrada">Tipo de entrada</label>

          <select
            id="tipoEntrada"
            value={tipo}
            onChange={e =>
              setTipo(
                e.target.value as 'adulto' | 'infantil'
              )
            }
          >
            <option value="adulto">
              Adulto — $20.000
            </option>

            <option value="infantil">
              Infantil — $12.000
            </option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="cantidad">Cantidad</label>

          <input
            id="cantidad"
            type="number"
            min={1}
            value={cantidad}
            onChange={e =>
              setCantidad(Number(e.target.value))
            }
          />
        </div>

        <div className={styles.summary}>
          <p>
            Total: <strong>${total.toLocaleString()}</strong>
          </p>

          <p>
            Puntos que ganarás:{' '}
            <strong>{puntos} ⭐</strong>
          </p>
        </div>

        <button
          className={styles.button}
          onClick={handleComprar}
          disabled={comprando}
        >
          {comprando
            ? 'Procesando...'
            : 'Comprar'}
        </button>
      </div>
    </div>
  )
}