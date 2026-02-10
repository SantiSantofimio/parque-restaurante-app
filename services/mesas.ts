import axios from 'axios'

export async function entrarAMesa(mesaId: string, user: { id: number, name: string }) {
  const res = await axios.post(`http://localhost:4000/api/mesas/${mesaId}/entrar`, { user })
  return res.data
}

export async function obtenerMesas(personas?: number) {
  const res = await axios.get(`http://localhost:4000/api/mesas`, {
    params: personas ? { personas } : {}
  })
  return res.data
}