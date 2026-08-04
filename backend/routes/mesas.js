import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import authMiddleware from '../middleware/authMiddleware.js' 
import { obtenerMesas, obtenerMesa, entrarAMesa, salirDeMesa, confirmarPedido } from '../controllers/mesasController.js'

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


  router.post('/:mesaId/pedidos', confirmarPedido)

export default router
