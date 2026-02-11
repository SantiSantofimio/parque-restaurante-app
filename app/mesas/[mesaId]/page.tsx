'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Mesa, Usuario } from '@/types/mesas'

const API_URL = 'http://localhost:4000/api/mesas'

export default function MesaDetallePage() {
  const params = useParams()
  const router = useRouter()
  const mesaId = params.mesaId as string

  const [mesa, setMesa] = useState<Mesa | null>(null)

  const user: Usuario = { id: 123, name: 'Santiago' }

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then((mesas: Mesa[]) => {
        const encontrada = mesas.find(m => m.id === mesaId)
        setMesa(encontrada || null)
      })
  }, [mesaId])

  async function handleSalir() {
    await fetch(`${API_URL}/${mesaId}/salir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    })

    router.push('/mesas')
  }

  async function handleSalirYPagar() {
    alert('Procesando pago... 💳')

    await fetch(`${API_URL}/${mesaId}/salir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    })

    router.push('/mesas')
  }

  if (!mesa) {
    return <div style={{ padding: 20 }}>Cargando mesa...</div>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Estás en {mesa.id}</h1>

      <p>Capacidad: {mesa.capacidad}</p>

      <h2>Menú del restaurante</h2>
      <ul>
        <li>🍔 Hamburguesa</li>
        <li>🍕 Pizza</li>
        <li>🥗 Ensalada</li>
        <li>🥤 Bebidas</li>
      </ul>

      <div style={{ marginTop: 30 }}>
        <button onClick={handleSalir} style={{ marginRight: 10 }}>
          Salir de la mesa
        </button>

        <button onClick={handleSalirYPagar}>
          Salir y pagar
        </button>
      </div>
    </div>
  )
}
