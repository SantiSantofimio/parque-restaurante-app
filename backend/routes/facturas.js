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
      user,
      mesaId,
      pedidos,
      total,
    } = req.body

    const facturas =
      readFacturas()

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

    saveFacturas(
      facturas
    )

    res.json({
      message:
        'Factura creada',
      factura:
        nuevaFactura,
    })
  }
)

export default router