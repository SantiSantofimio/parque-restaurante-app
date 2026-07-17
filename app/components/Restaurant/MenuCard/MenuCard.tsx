'use client'

import styles from './MenuCard.module.css'

interface Props{

producto:string

precio:number

imagen?:string

onAgregar:()=>void

}

export default function MenuCard({

producto,

precio,

imagen,

onAgregar

}:Props){

return(

<div className={styles.card}>

{imagen && (

<img

src={imagen}

alt={producto}

className={styles.image}

/>

)}

<h3>

{producto}

</h3>

<p>

${precio.toLocaleString()}

</p>

<button

onClick={onAgregar}

>

Agregar

</button>

</div>

)

}