'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Mesa, Usuario } from '@/types/mesas'
import { useRouter } from 'next/navigation'


const API_URL = 'http://localhost:4000/api/mesas'

// ============================
// API
// ============================
export async function obtenerMesas(): Promise<Mesa[]> {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error('Error al obtener mesas')
  return res.json()
}

export async function entrarAMesa(
  mesaId: string,
  user: Usuario
): Promise<{ mesa: Mesa }> {
  const res = await fetch(`${API_URL}/${mesaId}/entrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user }),
  })

  if (!res.ok) throw new Error('Error al entrar a la mesa')
  return res.json()
}

// ============================
// Página
// ============================
export default function MesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const router = useRouter()


  const user: Usuario = { id: 123, name: 'Santiago' }

  // ============================
  // Cargar mesas
  // ============================
  useEffect(() => {
    obtenerMesas()
      .then(setMesas)
      .catch(console.error)
  }, [])

  // ============================
  // Mesa actual (ÚNICA)
  // ============================
  const mesaActualId = useMemo(() => {
    const mesa = mesas.find(m =>
      m.usuarios.some(u => u.id === user.id)
    )
    return mesa?.id ?? null
  }, [mesas, user.id])

  // ============================
  // Entrar a una mesa
  // ============================
  async function handleEntrar(mesaId: string) {
    const { mesa } = await entrarAMesa(mesaId, user)

    setMesas(prev =>
      prev.map(m => {
        // quitar al usuario de TODAS las mesas
        const usuariosLimpios = m.usuarios.filter(
          u => u.id !== user.id
        )

        // si es la mesa destino, usar la del backend
        if (m.id === mesaId) return mesa

        return { ...m, usuarios: usuariosLimpios }
      })
    )
  }

  // ============================
  // Render
  // ============================
  return (
    <div style={{ padding: 20 }}>
      <h1>Mesas</h1>

      {mesaActualId && (
  <div
    style={{
      padding: 10,
      background: '#e6ffe6',
      marginBottom: 20,
      borderRadius: 6,
    }}
  >
    <div>
      Estás en la mesa <strong>{mesaActualId}</strong>
    </div>

    <div style={{ marginTop: 10 }}>
      <button
        onClick={() => router.push(`/mesas/${mesaActualId}`)}
        style={{
          padding: '6px 12px',
          cursor: 'pointer',
        }}
      >
        Ir a mi mesa
      </button>
    </div>
  </div>
    )   }


      {mesas.map(m => {
        const estoyAqui = m.id === mesaActualId

        return (
          <div
            key={m.id}
            style={{
              marginBottom: 10,
              padding: 10,
              border: '1px solid #ccc',
              borderRadius: 6,
              opacity: mesaActualId && !estoyAqui ? 0.5 : 1,
            }}
          >
            <div>
              <strong>{m.id}</strong> — Capacidad: {m.capacidad} —{' '}
              {m.ocupada ? 'Ocupada' : 'Libre'}{' '}
              {estoyAqui && '👤 (tú estás aquí)'}
            </div>

            {!mesaActualId && !m.ocupada && (
              <button
                onClick={() => handleEntrar(m.id)}
                style={{ marginTop: 5 }}
              >
                Entrar
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
