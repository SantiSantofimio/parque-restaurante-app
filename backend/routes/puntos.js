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
const POINTS_FILE = path.join(__dirname, '../data/puntos.json')

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'))
}

function readHistory() {
  if (!fs.existsSync(POINTS_FILE)) return []

  const raw = fs.readFileSync(POINTS_FILE, 'utf8')

  if (!raw.trim()) return []

  return JSON.parse(raw)
}

router.get('/', (req, res) => {
  const users = readUsers()

  const history = readHistory()

  const user = users.find(
    u => u.id === req.user.id
  )

  if (!user) {
    return res.status(404).json({
      error: 'Usuario no encontrado',
    })
  }

  const movimientos = history.filter(
    h => h.userId === req.user.id
  )

  res.json({
    puntos: user.puntos,
    historial: movimientos,
  })
})

export default router