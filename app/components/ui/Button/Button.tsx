'use client'

import styles from './Button.module.css'

interface Props{
    children:React.ReactNode
    onClick?:()=>void
}

export default function Button({
    children,
    onClick
}:Props){

    return(
        <button
            className={styles.button}
            onClick={onClick}
        >
            {children}
        </button>
    )
}