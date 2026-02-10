const express = require('express')
const cors = require('cors')
const mesasRoutes = require('./routes/mesas')

const app = express()
const PORT = 4000

// middlewares
app.use(cors())           // permitir requests desde cualquier frontend
app.use(express.json())   // parsear JSON en el body

// rutas
app.use('/api/mesas', mesasRoutes)  // router de mesas

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})