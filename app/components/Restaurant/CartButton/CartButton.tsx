'use client'

import styles from './CartButton.module.css'

interface Props {
  cantidad: number
  total: number
  onClick: () => void
}

export default function CartButton({
  cantidad,
  total,
  onClick,
}: Props) {
  // No mostramos el botón si
  // el carrito está vacío.
  if (cantidad === 0) {
    return null
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
    >
      <div className={styles.left}>
        <span className={styles.icon}>
          🛒
        </span>

        <span className={styles.badge}>
          {cantidad}
        </span>

        <span className={styles.text}>
          Ver pedido
        </span>
      </div>

      <strong className={styles.total}>
        ${total.toLocaleString()}
      </strong>
    </button>
  )
}