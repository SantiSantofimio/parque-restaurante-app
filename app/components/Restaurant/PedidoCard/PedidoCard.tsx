'use client'

import type { Pedido } from '@/types/mesas'
import styles from './PedidoCard.module.css'

interface Props{
    pedido:Pedido
}

export default function PedidoCard({
    pedido
}:Props){

return(

<div className={styles.card}>

    <div>

    <h3>{pedido.producto}</h3>

    <p>

        ${pedido.precio.toLocaleString()}

    </p>

    </div>

    <div className={styles.right}>

        <h2>

            x{pedido.cantidad}

        </h2>

        <strong>

            ${pedido.total.toLocaleString()}

        </strong>

    </div>

</div>

)

}