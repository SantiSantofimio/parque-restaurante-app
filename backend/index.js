import express from 'express'
import cors from 'cors'
import 'dotenv/config'


import ticketsRoutes from './routes/tickets.js'
import dashboardRoutes from './routes/dashboard.js'
import authRoutes from './routes/auth.js'
import mesasRoutes from './routes/mesas.js'
import facturasRoutes from './routes/facturas.js'
import contentRoutes from './routes/content.js'
import menuRoutes from './routes/menu.js'
import adminRoutes from './routes/admin/index.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 4000

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
app.use('/api/tickets', ticketsRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/admin', adminRoutes)
app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en http://localhost:${PORT}`
  )
})
app.use(errorHandler)

export default app