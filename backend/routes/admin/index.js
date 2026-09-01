import express from 'express'

import statusRouter from './status.js'
import usersRouter from './users.js'
import dashboardRouter from './dashboard.js'
import mesasRouter from './mesas.js'
import menuRouter from './menu.js'

const router = express.Router()

router.use(statusRouter)

router.use('/users', usersRouter)

router.use(dashboardRouter)

router.use('/mesas', mesasRouter)

router.use('/menu', menuRouter)

export default router