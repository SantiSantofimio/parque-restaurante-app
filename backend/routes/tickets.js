import crypto from 'crypto'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

const POINTS_FILE = path.join(__dirname, '../data/puntos.json')

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

function readPoints() {
  if (!fs.existsSync(POINTS_FILE)) return []

  const raw = fs.readFileSync(POINTS_FILE, 'utf8')

  if (!raw.trim()) return []

  return JSON.parse(raw)
}

function writePoints(points) {
  fs.writeFileSync(
    POINTS_FILE,
    JSON.stringify(points, null, 2)
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
    return res.status(400).json({ error: 'Datos incompletos' })
  }

  const total = cantidad * precio
  const puntosGanados = Math.floor(total / 1000)

  // Leer usuarios una sola vez
  const users = JSON.parse(fs.readFileSync(USER_FILE, 'utf-8'))
  const user = users.find(u => u.id === req.user.id)

  if (!user) {
    return res.status(400).json({ error: 'Usuario no encontrado' })
  }

  // Crear ticket
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

  // Sumar puntos ganados
  user.puntos += puntosGanados

  const history = readPoints()
  history.unshift({
    id: crypto.randomUUID(),
    userId: req.user.id,
    puntos: puntosGanados,
    descripcion: `Compra de ${cantidad} ${tipo}(s)`,
    fecha: new Date().toISOString(),
  })
  writePoints(history)

  // Guardar usuarios actualizados
  fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2))

  res.status(201).json({
    ticket,
    PuntosTotales: user.puntos
  })
})

export default router