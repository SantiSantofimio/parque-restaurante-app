import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import usersRepository from '../repositories/usersRepository.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET no ha sido configurado'
  )
}

// ============================
// REGISTRO
// ============================
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' })
  }

  const userExists = usersRepository.findByEmail(email)
  if (userExists) {
    return res.status(400).json({ message: 'El usuario ya existe' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword
  }

  usersRepository.save(newUser)

  res.status(201).json({ message: 'Usuario registrado correctamente' })
})

// ============================
// LOGIN
// ============================
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = usersRepository.findByEmail(email)

  if (!user) {
    return res.status(400).json({ message: 'Credenciales incorrectas' })
  }

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return res.status(400).json({ message: 'Credenciales incorrectas' })
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,

      role:
      user.role || 'customer', 
    },
    JWT_SECRET,
    {
      expiresIn: '1d',
    }
  )

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,

      role:
      user.role || 'customer',
    },
  })
})

export default router