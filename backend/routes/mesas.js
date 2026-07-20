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
const MENU_FILE =path.join(__dirname, '../content/menu.json')

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

function readMenu() {
  if (!fs.existsSync(MENU_FILE)) {
     return []
}

  const raw = fs.readFileSync(MENU_FILE, 'utf-8')

  if (!raw.trim()) {
    return []
  }
  return JSON.parse(raw)
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

// ============================
// Confirmar carrito como pedido
// ============================

router.post(
  '/:mesaId/pedidos',
  (req, res) => {

    const { mesaId } =
      req.params

    const { productos } =
      req.body

    // Usuario autenticado
    const userId =
      req.user.id

    // ============================
    // Validar carrito
    // ============================

    if (
      !Array.isArray(productos) ||
      productos.length === 0
    ) {
      return res
        .status(400)
        .json({
          error:
            'El carrito está vacío',
        })
    }

    const mesas =
      readMesas()

    const mesa =
      mesas.find(
        m =>
          m.id === mesaId
      )

    // ============================
    // Validar mesa
    // ============================

    if (!mesa) {
      return res
        .status(404)
        .json({
          error:
            'Mesa no encontrada',
        })
    }

    // ============================
    // Validar usuario en mesa
    // ============================

    const usuarioEnMesa =
      mesa.usuarios.some(
        usuario =>
          String(usuario.id) ===
          String(userId)
      )

    if (!usuarioEnMesa) {
      return res
        .status(403)
        .json({
          error:
            'No perteneces a esta mesa',
        })
    }

    // ============================
    // Leer menú real
    // ============================

    const menu =
      readMenu()

    if (!menu.length) {
      return res
        .status(500)
        .json({
          error:
            'El menú no está disponible',
        })
    }

    if (!mesa.pedidos) {
      mesa.pedidos = []
    }

    // ============================
    // Procesar productos
    // ============================

    for (
      const item of productos
    ) {

      const cantidad =
        Number(item.cantidad)

      // Validar cantidad
      if (
        !Number.isInteger(
          cantidad
        ) ||
        cantidad <= 0
      ) {
        return res
          .status(400)
          .json({
            error:
              'Cantidad de producto inválida',
          })
      }

      // Buscar producto real
      const productoReal =
        menu.find(
          producto =>
            String(producto.id) ===
            String(
              item.productoId
            )
        )

      if (!productoReal) {
        return res
          .status(400)
          .json({
            error:
              `Producto ${item.productoId} no encontrado`,
          })
      }

      if (
        productoReal.disponible ===
        false
      ) {
        return res
          .status(400)
          .json({
            error:
              `${productoReal.nombre} no está disponible`,
          })
      }

      // ============================
      // Crear pedido
      // ============================

      const nuevoPedido = {
        id:
          Date.now() +
          Math.floor(
            Math.random() *
            100000
          ),

        productoId:
          String(
            productoReal.id
          ),

        producto:
          productoReal.nombre,

        precio:
          productoReal.precio,

        cantidad,

        total:
          productoReal.precio *
          cantidad,

        observaciones:
          item.observaciones ||
          '',

        userId,
      }

      mesa.pedidos.push(
        nuevoPedido
      )
    }

    // ============================
    // Guardar mesa
    // ============================

    writeMesas(mesas)

    // ============================
    // Respuesta
    // ============================

    return res
      .status(201)
      .json({
        message:
          'Pedido confirmado correctamente',

        mesa,
      })
  }
)

export default router
