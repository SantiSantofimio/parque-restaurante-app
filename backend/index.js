import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import mesasRoutes from './routes/mesas.js'
import facturasRoutes from './routes/facturas.js'

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
app.use('/api/facturas', facturasRoutes)
app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en http://localhost:${PORT}`
  )
})

export default app