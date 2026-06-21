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

router.post('/', (req, res) => {
  const { tipo, cantidad } = req.body

  const precioUnitario =
    tipo === 'adulto'
      ? 25000
      : 15000

  const ticket = {
    id: `ticket-${Date.now()}`,
    userId: req.user.id,
    tipo,
    cantidad,
    precioUnitario,
    total: precioUnitario * cantidad,
    estado: 'activo',
    fechaCompra: new Date().toISOString(),
    codigoQR: crypto.randomUUID(),
  }

  const tickets = readTickets()

  tickets.push(ticket)

  writeTickets(tickets)

  res.status(201).json(ticket)
})

export default router