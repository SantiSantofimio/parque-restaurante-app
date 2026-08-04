import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import authMiddleware from '../middleware/authMiddleware.js'
import mesasRepository from '../repositories/mesasRepository.js'

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
router.get(
  '/',
  (req, res) => {

    const {
      personas,
    } = req.query

    const mesas =
      mesasRepository.getAll()


    // ==========================
    // Sin filtro
    // ==========================

    if (
      !personas
    ) {

      return res.json(
        mesas
      )

    }


    // ==========================
    // Personas solicitadas
    // ==========================

    const cantidadPersonas =
      Number(
        personas
      )


    if (
      Number.isNaN(
        cantidadPersonas
      ) ||
      cantidadPersonas < 1
    ) {

      return res
        .status(400)
        .json({
          error:
            'Cantidad de personas inválida',
        })

    }


    // ==========================
    // Mesas con espacio
    // ==========================

    const disponibles =
      mesasRepository.findAvailable(
        cantidadPersonas
      )

    return res.json(
      disponibles
    )

  }
)

router.get('/:mesaId', (req, res) => {
  const { mesaId } = req.params

  const mesa = mesasRepository.findById(mesaId)

  if (!mesasRepository.exists(mesaId)) {
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

  // El usuario viene del JWT gracias a authMiddleware.
  // Ya no confiamos en un usuario enviado desde el frontend.
  const user = req.user

  if (!user || !user.id) {
    return res.status(401).json({
      error: 'Usuario no autenticado',
    })
  }

  const mesa = mesasRepository.findById(mesaId)

  if (!mesa) {
    return res.status(404).json({
      error: 'Mesa no encontrada',
    })
  }

  // ============================
  // Verificar si el usuario
  // ya pertenece a alguna mesa
  // ============================
  const mesaActual = mesasRepository.findByUserId(user.id)

  if (mesaActual) {
    // Si intenta entrar nuevamente
    // a la misma mesa, devolvemos
    // la mesa actual sin duplicarlo.
    if (mesaActual.id === mesaId) {
      return res.json({
        message: 'Ya perteneces a esta mesa',
        mesa: mesaActual,
      })
    }

    return res.status(400).json({
      error: `Ya perteneces a la ${mesaActual.id}`,
    })
  }

  // ============================
  // Comprobar capacidad
  // ============================
  if (
    mesa.usuarios.length >=
    mesa.capacidad
  ) {
    return res.status(400).json({
      error: 'Mesa llena',
    })
  }

  // ============================
  // Agregar usuario
  // ============================
  mesa.usuarios.push({
    id: user.id,
    name: user.name,
  })

  mesa.ocupada = true

  mesasRepository.update(mesa)

  return res.json({
    message: 'Entraste a la mesa',
    mesa,
  })
})

// ============================
// Salir de una mesa
// ============================

router.post(
  '/:mesaId/salir',
  (req, res) => {

    const {
      mesaId,
    } = req.params

    // No confiamos en un usuario
    // enviado desde el frontend.
    // Usamos el usuario autenticado
    // del token JWT.
    const user =
      req.user


    // ==========================
    // Validar autenticación
    // ==========================

    if (
      !user ||
      !user.id
    ) {

      return res
        .status(401)
        .json({
          error:
            'Usuario no autenticado',
        })

    }


    // ==========================
    // Buscar mesa
    // ==========================

    const mesa =
      mesasRepository.findById(
        mesaId
      )


    if (
      !mesa
    ) {

      return res
        .status(404)
        .json({
          error:
            'Mesa no encontrada',
        })

    }


    // ==========================
    // Verificar que pertenece
    // a la mesa
    // ==========================

    const usuarioEnMesa =
      mesa.usuarios.some(
        usuario =>
          usuario.id ===
          user.id
      )


    if (
      !usuarioEnMesa
    ) {

      return res
        .status(400)
        .json({
          error:
            'No perteneces a esta mesa',
        })

    }


    // ==========================
    // Buscar pedidos pendientes
    // del usuario actual
    // ==========================

    const pedidosUsuario =
      (
        mesa.pedidos || []
      ).filter(
        pedido =>
          pedido.userId ===
          user.id
      )


    // ==========================
    // No permitir salir
    // con pedidos propios
    // pendientes
    // ==========================

    if (
      pedidosUsuario.length >
      0
    ) {

      return res
        .status(400)
        .json({

          error:
            'Tienes pedidos pendientes. Debes pagar tu consumo antes de salir de la mesa.',

        })

    }


    // ==========================
    // Eliminar usuario
    // ==========================

    mesa.usuarios =
      mesa.usuarios.filter(
        usuario =>
          usuario.id !==
          user.id
      )


    // ==========================
    // Actualizar estado de mesa
    // ==========================

    if (
      mesa.usuarios.length === 0
    ) {

      // El último usuario salió.
      // La mesa vuelve completamente
      // al estado disponible.

      mesa.usuarios = []
      mesa.pedidos = []
      mesa.ocupada = false

    } else {

      // Todavía quedan usuarios
      // utilizando la mesa.

      mesa.ocupada = true

    }


    // ==========================
    // Guardar
    // ==========================

    mesasRepository.update(mesa)


    // ==========================
    // Respuesta
    // ==========================

      return res.json({

        message:
          'Saliste de la mesa correctamente',

        mesa,

      })

    }
  )

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
