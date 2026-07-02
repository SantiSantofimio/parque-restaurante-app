'use client'

import styles from './LoyaltyCard.module.css'

interface Props{
    nombre:string
    puntos:number
    tickets:number
}

export default function LoyaltyCard({
    nombre,
    puntos,
    tickets
}:Props){

    function nivel(){

        if(puntos>=5000) return 'Diamante'

        if(puntos>=2500) return 'Oro'

        if(puntos>=1000) return 'Plata'

        return 'Bronce'
    }

    function siguienteNivel(){

        if(puntos<1000) return 1000

        if(puntos<2500) return 2500

        if(puntos<5000) return 5000

        return 5000
    }

    const progreso=Math.min(
        puntos/siguienteNivel()*100,
        100
    )

    return(

<div className={styles.card}>

<h2>

👋 Hola {nombre}

</h2>

<h1>

⭐ {puntos}

</h1>

<p>

Nivel {nivel()}

</p>

<div className={styles.progress}>

<div
className={styles.fill}
style={{
width:`${progreso}%`
}}
/>

</div>

<small>

{Math.max(0,siguienteNivel()-puntos)}
 puntos para el siguiente nivel

</small>

<div className={styles.footer}>

<div>

🎟

<h3>

{tickets}

</h3>

<p>Tickets</p>

</div>

<div>

🎁

<h3>

Beneficios

</h3>

<p>Disponibles</p>

</div>

</div>

</div>

    )

}