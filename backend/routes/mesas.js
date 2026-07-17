import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()
router.use(authMiddleware)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MESAS_FILE = path.join(__dirname, '../data/mesas.json')

// ============================
// Helpers
// ============================
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
// Obtener mesas
// ============================
router.get('/', (req, res) => {
  const { personas } = req.query
  const mesas = readMesas()

  const disponibles = personas
    ? mesas.filter((m) => !m.ocupada && m.capacidad >= Number(personas))
    : mesas

  res.json(disponibles)
})

router.get('/:mesaId', (req, res) => {
  const { mesaId } = req.params

  const mesas = readMesas()

  const mesa = mesas.find(
    m => m.id === mesaId
  )

  if (!mesa) {
    return res.status(404).json({
      error: 'Mesa no encontrada',
    })
  }

  res.json(mesa)
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

  if (!mesa)
    return res.status(404).json({ error: 'Mesa no encontrada' })

  const usuarioYaEnMesa = mesa.usuarios.some((u) => u.id === user.id)

  if (usuarioYaEnMesa) {
    return res.status(400).json({ error: 'Usuario ya está en la mesa' })
  }

  if (mesa.usuarios.length >= mesa.capacidad) {
    return res.status(400).json({ error: 'Mesa llena' })
  }

  mesa.usuarios.push(user)
  mesa.ocupada = mesa.usuarios.length > 0

  writeMesas(mesas)

  res.json({
    message: 'Entraste a la mesa',
    mesa,
  })
})

// ============================
// Salir de una mesa
// ============================
router.post('/:mesaId/salir', (req, res) => {
  const { mesaId } = req.params
  const { user } = req.body

  if (!user || !user.id) {
    return res.status(400).json({ error: 'Usuario requerido' })
  }

  const mesas = readMesas()
  const mesa = mesas.find((m) => m.id === mesaId)

  if (!mesa)
    return res.status(404).json({ error: 'Mesa no encontrada' })

  if (mesa.pedidos && mesa.pedidos.length > 0) {
    return res.status(400).json({
      error:
        'No puedes salir con pedidos pendientes. Primero paga o elimina los pedidos.',
    })
  }

  // quitar usuario
  mesa.usuarios = mesa.usuarios.filter(
    (u) => u.id !== user.id
  )

  // si ya no hay usuarios → mesa libre
  if (mesa.usuarios.length === 0) {
    mesa.ocupada = false
  }

  writeMesas(mesas)

  res.json({
    message: 'Saliste de la mesa',
    mesa,
  })
})

// ============================
// Agregar pedido a mesa
// ============================
router.post(
  '/:mesaId/pedido',
  (req, res) => {
    const { mesaId } =
      req.params

    const {
      producto,
      precio,
      cantidad = 1,
    } = req.body

    const mesas =
      readMesas()

    const mesa =
      mesas.find(
        (m) =>
          m.id === mesaId
      )

    if (!mesa) {
      return res
        .status(404)
        .json({
          error:
            'Mesa no encontrada',
        })
    }

    if (!mesa.pedidos) {
      mesa.pedidos = []
    }

    const pedidoExistente =
  mesa.pedidos.find(
    (p) =>
      p.producto === producto
  )

if (pedidoExistente) {
  pedidoExistente.cantidad +=
    cantidad

  pedidoExistente.total =
    pedidoExistente.precio *
    pedidoExistente.cantidad
} else {
  mesa.pedidos.push({
    id: Date.now(),
    producto,
    precio,
    cantidad,
    total:
      precio * cantidad,
  })
}

    writeMesas(mesas)

    res.json({
      message:
        'Pedido agregado',
      pedidos:
        mesa.pedidos,
    })
  }
)

// ============================
// Actualizar cantidad pedido
// ============================
router.put(
  '/:mesaId/pedido',
  (req, res) => {
    const { mesaId } =
      req.params

    const {
      producto,
      action,
    } = req.body

    const mesas =
      readMesas()

    const mesa =
      mesas.find(
        (m) =>
          m.id === mesaId
      )

    if (!mesa) {
      return res
        .status(404)
        .json({
          error:
            'Mesa no encontrada',
        })
    }

    if (!mesa.pedidos) {
      return res
        .status(404)
        .json({
          error:
            'No hay pedidos',
        })
    }

    const pedido =
      mesa.pedidos.find(
        (p) =>
          p.producto ===
          producto
      )

    if (!pedido) {
      return res
        .status(404)
        .json({
          error:
            'Pedido no encontrado',
        })
    }

    // sumar
    if (action === 'add') {
      pedido.cantidad += 1
    }

    // restar
    if (
      action === 'remove'
    ) {
      pedido.cantidad -= 1
    }

    // recalcular total
    pedido.total =
      pedido.precio *
      pedido.cantidad

    // eliminar si llega a 0
    mesa.pedidos =
      mesa.pedidos.filter(
        (p) =>
          p.cantidad > 0
      )

    writeMesas(mesas)

    res.json({
      message:
        'Pedido actualizado',
      pedidos:
        mesa.pedidos,
    })
  }
)

export default router
