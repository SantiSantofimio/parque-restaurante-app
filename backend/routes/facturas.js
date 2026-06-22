import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import authMiddleware from '../middleware/authMiddleware.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const router = express.Router()
router.use(authMiddleware)

const FACTURAS_FILE =
  path.join(
    __dirname,
    '../data/facturas.json'
  )
const MESAS_FILE =
  path.join(
    __dirname,
    '../data/mesas.json'
  )

function readMesas() {
  if (!fs.existsSync(MESAS_FILE)) return []
  const raw = fs.readFileSync(MESAS_FILE, 'utf-8')
  if (!raw.trim()) return []
  return JSON.parse(raw)
}

function writeMesas(mesas) {
  fs.writeFileSync(MESAS_FILE, JSON.stringify(mesas, null, 2))
}

function readFacturas() {
  if (
    !fs.existsSync(
      FACTURAS_FILE
    )
  )
    return []

  const raw =
    fs.readFileSync(
      FACTURAS_FILE,
      'utf-8'
    )

  if (!raw.trim())
    return []

  return JSON.parse(raw)
}

/**
 * @param {Array} facturas
 */
function saveFacturas(
  facturas
) {
  fs.writeFileSync(
    FACTURAS_FILE,
    JSON.stringify(
      facturas,
      null,
      2
    )
  )
}

// ============================
// Crear factura
// ============================
router.post(
  '/',
  (req, res) => {
    const {
      mesaId,
      pedidos,
      total,
    } = req.body

    const user = req.user

    if (
        !user ||
        !mesaId ||
        !pedidos
    ) {
      return res
        .status(400)
        .json({
            error:
                'Datos incompletos',
        })
    }

    const facturas =
      readFacturas()

    const mesas =
      readMesas()
    const mesa = mesas.find(
      (m) => m.id === mesaId
    )

    if (!mesa) {
      return res.status(404).json({
        error: 'Mesa no encontrada',
      })
    }

    const nuevaFactura =
      {
        id: Date.now(),
        user,
        mesaId,
        pedidos,
        total,
        createdAt:
          new Date(),
      }

    facturas.push(
      nuevaFactura
    )

    // Al pagar, se consumen los pedidos de la mesa
    mesa.pedidos = []

    saveFacturas(
      facturas
    )
    writeMesas(mesas)

    res.json({
      message:
        'Factura creada',
      factura:
        nuevaFactura,
    })
  }
)

router.get(
  '/',
  (req, res) => {
    const facturas =
      readFacturas()

    res.json(facturas)
  }
)

export default router