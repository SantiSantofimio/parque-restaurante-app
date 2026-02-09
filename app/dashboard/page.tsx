'use client'
import { useRouter } from 'next/navigation'


export default function Dashboard() {
const router = useRouter()


return (
<div className="p-4">
<h1 className="text-xl font-bold mb-4">Bienvenido al Parque</h1>


<div className="grid gap-4">
<button className="card" onClick={() => router.push('/mesa/1')}>🍽 Restaurante</button>
<button className="card" onClick={() => router.push('/atracciones')}>🎢 Atracciones</button>
</div>
</div>
)
}