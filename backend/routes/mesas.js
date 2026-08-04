import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import authMiddleware from '../middleware/authMiddleware.js'
import mesasRepository from '../repositories/mesasRepository.js'
import { obtenerMesas, obtenerMesa, entrarAMesa, salirDeMesa } from '../controllers/mesasController.js'

const router = express.Router()
router.use(authMiddleware)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MENU_FILE =path.join(__dirname, '../content/menu.json')

// ============================
// Helpers
// ============================

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
router.get('/', obtenerMesas)


router.get('/:mesaId', obtenerMesa)

// ============================
// Entrar a una mesa
// ============================
router.post('/:mesaId/entrar', entrarAMesa)

// ============================
// Salir de una mesa
// ============================

router.post('/:mesaId/salir', salirDeMesa)


  router.post('/:mesaId/pedidos', (req, res) => {

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
    const mesa =
      mesasRepository.findById(
        mesaId
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
        
        userId:
          req.user.id,

        userName:
          req.user.name,

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
      }

      mesa.pedidos.push(
        nuevoPedido
      )
    }

    // ============================
    // Guardar mesa
    // ============================

    mesasRepository.update(mesa)

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
