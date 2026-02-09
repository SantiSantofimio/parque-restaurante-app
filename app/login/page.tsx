'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/services/api'


export default function LoginPage() {
const router = useRouter()
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')


const handleLogin = async () => {
  try {
    const data = await login(email, password)
    localStorage.setItem('token', data.token)
    router.push('/dashboard')
  } catch (err) {
    alert('Email o contraseña incorrectos')
  }
}


return (
<div className="min-h-screen flex items-center justify-center p-4">
<div className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
<h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
<input className="input" placeholder="Email" onChange={e => setEmail(e.target.value)} />
<input className="input mt-2" type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} />
<button className="btn mt-4" onClick={handleLogin}>Entrar</button>
</div>
</div>
)
}