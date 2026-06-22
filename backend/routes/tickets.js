import crypto from 'crypto'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TICKETS_FILE = path.join(
  __dirname,
  '../data/tickets.json'
)
const USER_FILE = path.join(__dirname, '../data/users.json')

function readTickets() {
  if (!fs.existsSync(TICKETS_FILE)) return []

  const raw = fs.readFileSync(
    TICKETS_FILE,
    'utf-8'
  )

  if (!raw.trim()) return []

  return JSON.parse(raw)
}

function writeTickets(tickets) {
  fs.writeFileSync(
    TICKETS_FILE,
    JSON.stringify(tickets, null, 2)
  )
}

router.get('/', (req, res) => {
  const tickets = readTickets()

  const userTickets = tickets.filter(
    t => t.userId === req.user.id
  )

  res.json(userTickets)
})

router.post('/comprar', (req, res) => {
  const { tipo, cantidad, precio } = req.body

  if (!tipo || !cantidad || !precio) {
    return res.status(400).json({
      error: 'Datos incompletos',
    })
  }

  const total = cantidad * precio
  const puntosGanados = Math.floor(total / 1000)
  // Ejemplo: 10 puntos por cada $1000 gastados

  // Verificar si el usuario tiene suficientes puntos
  const users = JSON.parse(fs.readFileSync(USER_FILE, 'utf-8'))
  const user = users.find(u => u.id === req.user.id)

  if (!user || user.puntos < total) {
    return res.status(400).json({
      error: 'Puntos insuficientes',
    })
  }
    // Restar los puntos al usuario
    user.puntos -= total
    fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2)) 

  const ticket = {
    id: `ticket-${Date.now()}`,
    userId: req.user.id,
    tipo,
    cantidad,
    precioUnitario: precio,
    total,
    puntosGanados,
    estado: 'activo',
    fechaCompra: new Date().toISOString(),
    codigoQR: crypto.randomUUID(),
  }

  const tickets = readTickets()

  tickets.push(ticket)

  writeTickets(tickets)

  // Actualizar puntos del usuario
  const users = JSON.parse(fs.readFileSync(USER_FILE, 'utf-8'))
  const user = users.find(u => u.id === req.user.id)
  user.puntos += puntosGanados
  fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2))

  if (user) {
    user.puntos = (user.puntos || 0) + puntosGanados
    fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2))
  }

  res.status(201).json({ticket, PuntosTotales: user?.puntos || 0,})
})

export default router