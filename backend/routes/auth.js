import express from 'express'

import asyncHandler from '../utils/asyncHandler.js'

import {
  registrarUsuario,
  login
} from '../controllers/authController.js'

const router = express.Router()

// ============================
// REGISTRO
// ============================
router.post('/register', asyncHandler(registrarUsuario))

// ============================
// LOGIN
// ============================
router.post('/login', asyncHandler(login))

export default router