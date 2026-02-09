'use client'
import { useState } from 'react'


export default function MesaPage() {
const [menuOpen, setMenuOpen] = useState(false)


return (
<div className="p-4">
<h1 className="text-xl font-bold">Mesa #1</h1>


<button className="btn mt-4" onClick={() => setMenuOpen(true)}>Ver Menú</button>
<button className="btn-secondary mt-2">Finalizar y Pagar</button>


{menuOpen && (
<div className="mt-4">
<p>🍔 Hamburguesa - $10</p>
<p>🍕 Pizza - $12</p>
</div>
)}
</div>
)
}