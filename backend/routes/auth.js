const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const router = express.Router()

const USERS_FILE = path.join(__dirname, '../data/users.json')
const JWT_SECRET = 'super_secret_key'

// helper para leer usuarios
function readUsers() {
  const data = fs.readFileSync(USERS_FILE, 'utf-8')
  return JSON.parse(data)
}

// helper para guardar usuarios
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

// ============================
// REGISTRO
// ============================
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' })
  }

  const users = readUsers()

  const userExists = users.find(u => u.email === email)
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

  users.push(newUser)
  saveUsers(users)

  res.status(201).json({ message: 'Usuario registrado correctamente' })
})

// ============================
// LOGIN
// ============================
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const users = readUsers()
  const user = users.find(u => u.email === email)

  if (!user) {
    return res.status(400).json({ message: 'Credenciales incorrectas' })
  }

  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return res.status(400).json({ message: 'Credenciales incorrectas' })
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1d' }
  )

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  })
})

module.exports = router