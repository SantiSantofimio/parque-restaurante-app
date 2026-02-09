'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { register } from '@/services/api'

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert('Completa todos los campos')
      return
    }

    try {
      setLoading(true)
      await register(name, email, password)
      alert('Usuario creado correctamente')
      router.push('/login')
    } catch (error) {
      alert('Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Crear Cuenta
        </h1>

        <input
          className="input"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input mt-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input mt-3"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn mt-4"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Registrarse'}
        </button>
      </div>
    </div>
  )
}