'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Mesa = {
  id: number
  capacidad: number
  ocupada?: boolean
  usuarios?: { id: number; name: string }[]
  pedidos?: any[]
}

export default function MesasPage() {
  const router = useRouter()
  const [personas, setPersonas] = useState<number>(2)
  const [mesas, setMesas] = useState<Mesa[]>([]) // ✅ importante
  const [loading, setLoading] = useState<boolean>(false)

  const user =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null

  useEffect(() => {
    fetchMesas()
  }, [personas])

  const fetchMesas = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:4000/api/mesas?personas=${personas}`
      )
      const data: Mesa[] = await res.json()
      setMesas(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const entrarMesa = async (mesaId: number) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/mesas/${mesaId}/entrar`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        }
      )
      const data: Mesa = await res.json()
      router.push(`/mesa/${data.id}`)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Selecciona una mesa 🍽️
      </h1>

      <div className="mb-6">
        <label className="block mb-2 font-semibold">
          ¿Cuántas personas?
        </label>
        <select
          value={personas}
          onChange={(e) => setPersonas(Number(e.target.value))}
          className="w-full p-3 border rounded"
        >
          <option value={2}>2 personas</option>
          <option value={4}>4 personas</option>
          <option value={6}>6 personas</option>
          <option value={8}>8 personas</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center">Cargando mesas...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {mesas.map((mesa) => (
            <div
              key={mesa.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-bold">Mesa #{mesa.id}</p>
                <p className="text-sm text-gray-600">
                  Capacidad: {mesa.capacidad}
                </p>
              </div>

              <button
                onClick={() => entrarMesa(mesa.id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Elegir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}