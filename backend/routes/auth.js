import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Base de datos temporal
const users = []

// REGISTRO
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
  }

  users.push(user)

  res.json({ message: 'Usuario creado correctamente' })
})

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = users.find(u => u.email === email)
  if (!user) {
    return res.status(401).json({ message: 'Usuario no encontrado' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ message: 'Contraseña incorrecta' })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  res.json({ token })
})

export default router