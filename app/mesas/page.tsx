'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MESAS = [
  { id: 1, capacidad: 2 },
  { id: 2, capacidad: 4 },
  { id: 3, capacidad: 4 },
  { id: 4, capacidad: 6 },
  { id: 5, capacidad: 8 },
]

export default function MesasPage() {
  const router = useRouter()
  const [personas, setPersonas] = useState(2)

  const mesasDisponibles = MESAS.filter(
    (mesa) => mesa.capacidad >= personas
  )

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

      <div className="grid grid-cols-1 gap-4">
        {mesasDisponibles.map((mesa) => (
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
              onClick={() => router.push(`/mesa/${mesa.id}`)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Elegir
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}