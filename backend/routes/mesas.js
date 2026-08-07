import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js' 
import { obtenerMesas, obtenerMesa, entrarAMesa, salirDeMesa, confirmarPedido } from '../controllers/mesasController.js'
import asynHandler from '../utils/asyncHandler.js'

const router = express.Router()
router.use(authMiddleware)

// ============================
// Obtener mesas
// ============================
router.get('/', asynHandler(obtenerMesas))


router.get('/:mesaId', asynHandler(obtenerMesa))

// ============================
// Entrar a una mesa
// ============================
router.post('/:mesaId/entrar', asynHandler(entrarAMesa))

// ============================
// Salir de una mesa
// ============================

router.post('/:mesaId/salir', asynHandler(salirDeMesa))


  router.post('/:mesaId/pedidos', asynHandler(confirmarPedido))

export default router
