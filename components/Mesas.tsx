import { useEffect, useState } from 'react'
import { entrarAMesa, obtenerMesas } from '@/services/mesas'

interface Usuario {
  id: number
  name: string
}

interface Mesa {
  id: string
  capacidad: number
  ocupada: boolean
  usuarios: Usuario[]
}

export default function Mesas() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const user = { id: 123, name: 'Santiago' }

  useEffect(() => {
    async function fetchMesas() {
      const data = await obtenerMesas() as Mesa[]
      setMesas(data)
    }
    fetchMesas()
  }, [])

  async function handleEntrar(mesaId: string) {
    try {
      const data = await entrarAMesa(mesaId, user) as { mesa: Mesa }
      setMesas(prev => prev.map(m => m.id === mesaId ? data.mesa : m))
      alert(`Entraste a la mesa ${mesaId}`)
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error desconocido')
    }
  }

  return (
    <div>
      <h1>Mesas Disponibles</h1>
      {mesas.map(m => (
        <div key={m.id} style={{ margin: '10px 0' }}>
          <span>{m.id} - Capacidad: {m.capacidad} - {m.ocupada ? 'Ocupada' : 'Libre'}</span>
          {!m.ocupada && <button onClick={() => handleEntrar(m.id)} style={{ marginLeft: '10px' }}>Entrar</button>}
        </div>
      ))}
    </div>
  )
}