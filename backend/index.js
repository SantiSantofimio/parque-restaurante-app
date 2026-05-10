const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const mesasRoutes = require('./routes/mesas')

const app = express()
const PORT = 4000

// ============================
// Middlewares
// ============================
app.use(cors())
app.use(express.json())

// ============================
// Test route
// ============================
app.get('/', (req, res) => {
  res.send('Backend funcionando 🚀')
})

// ============================
// Rutas
// ============================
app.use('/api/auth', authRoutes)
app.use('/api/mesas', mesasRoutes)

app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en http://localhost:${PORT}`
  )
})