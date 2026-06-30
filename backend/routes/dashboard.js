import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const USERS_FILE = path.join(__dirname, '../data/users.json')
const TICKETS_FILE = path.join(__dirname, '../data/tickets.json')
const MESAS_FILE = path.join(__dirname, '../data/mesas.json')

router.get('/', (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE))
  const tickets = JSON.parse(fs.readFileSync(TICKETS_FILE))
  const mesas = JSON.parse(fs.readFileSync(MESAS_FILE))

  const user = users.find(
    u => u.id === req.user.id
  )

  const ticketsActivos =
    tickets.filter(
      t =>
        t.userId === req.user.id &&
        t.estado === 'activo'
    ).length

  const mesa =
    mesas.find(m =>
      m.usuarios.some(
        u => u.id === req.user.id
      )
    )

  res.json({
    puntos: user?.puntos ?? 0,
    ticketsActivos,
    mesaActual: mesa?.id ?? null,
  })
})

export default router