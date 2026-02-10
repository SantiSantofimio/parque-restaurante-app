const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()
const MESAS_FILE = path.join(__dirname, '../data/mesas.json')

// helpers
function readMesas() {
  if (!fs.existsSync(MESAS_FILE)) return []
  const raw = fs.readFileSync(MESAS_FILE, 'utf-8')
  if (!raw.trim()) return []
  return JSON.parse(raw)
}

function writeMesas(mesas) {
  fs.writeFileSync(MESAS_FILE, JSON.stringify(mesas, null, 2))
}

// ============================
// Obtener mesas disponibles
// ============================
router.get('/', (req, res) => {
  const { personas } = req.query
  const mesas = readMesas()

  const disponibles = personas
    ? mesas.filter((m) => !m.ocupada && m.capacidad >= Number(personas))
    : mesas

  res.json(disponibles)
})

// ============================
// Entrar a una mesa
// ============================
router.post('/:mesaId/entrar', (req, res) => {
  const { mesaId } = req.params
  const { user } = req.body

  if (!user || !user.id) {
    return res.status(400).json({ error: 'Usuario requerido' })
  }

  const mesas = readMesas()
  const mesa = mesas.find((m) => m.id === mesaId)

  if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' })
  if (mesa.ocupada) return res.status(409).json({ error: 'Mesa ya está ocupada' })

  mesa.ocupada = true
  mesa.usuarios = [user]

  writeMesas(mesas)

  res.json({
    message: 'Entraste a la mesa',
    mesa,
  })
})

module.exports = router