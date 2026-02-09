'use client'

import { useParams, useRouter } from 'next/navigation'

export default function MesaPage() {
  const params = useParams()
  const router = useRouter()
  const mesaId = params.id

  const user =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">
        Mesa #{mesaId} 🍽️
      </h1>

      <p className="mb-4">
        Usuario: <strong>{user?.name}</strong>
      </p>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold mb-2">Opciones</h2>

        <button
          className="w-full mb-3 bg-blue-600 text-white py-3 rounded"
          onClick={() => alert('Menú próximamente')}
        >
          Ver menú 📋
        </button>

        <button
          className="w-full mb-3 bg-yellow-500 text-white py-3 rounded"
          onClick={() => alert('Invitar usuarios próximamente')}
        >
          Invitar personas 👥
        </button>

        <button
          className="w-full bg-red-600 text-white py-3 rounded"
          onClick={() => alert('Pago próximamente')}
        >
          Finalizar y pagar 💳
        </button>
      </div>

      <button
        className="text-sm text-gray-600 underline"
        onClick={() => router.push('/mesas')}
      >
        ← Volver a mesas
      </button>
    </div>
  )
}