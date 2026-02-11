'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { salirDeMesa } from '@/services/mesas'
import type { Mesa, Usuario } from '@/types/mesas'

const API_URL = 'http://localhost:4000/api/mesas'

export default function MesaDetalle({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [mesa, setMesa] = useState<Mesa | null>(null)

  const user: Usuario = { id: 123, name: 'Santiago' }

  // Cargar mesa
  useEffect(() => {
    async function fetchMesa() {
      const res = await fetch(`${API_URL}`)
      const data: Mesa[] = await res.json()
      const encontrada = data.find(m => m.id === params.id)
      setMesa(encontrada || null)
    }

    fetchMesa()
  }, [params.id])

  async function handleSalir() {
    try {
      await salirDeMesa(params.id, user)
      router.push('/mesas')
    } catch (err) {
      alert('Error al salir')
    }
  }

  if (!mesa) return <div>Cargando...</div>

  return (
    <div style={{ padding: 20 }}>
      <h1>Mesa {mesa.id}</h1>

      <h3>Usuarios en la mesa:</h3>
      <ul>
        {mesa.usuarios.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>

      <hr />

      <h2>Menú del Restaurante</h2>
      <ul>
        <li>🍔 Hamburguesa - $20</li>
        <li>🍕 Pizza - $25</li>
        <li>🥤 Bebida - $5</li>
      </ul>

      <button
        onClick={handleSalir}
        style={{
          marginTop: 20,
          padding: 10,
          background: 'red',
          color: 'white',
          borderRadius: 6,
        }}
      >
        Salir de la mesa
      </button>
    </div>
  )
}
