import express from 'express'

import statusRouter from './status.js'
import usersRouter from './users.js'
import dashboardRouter from './dashboard.js'

const router = express.Router()

router.use(statusRouter)

router.use('/users', usersRouter)

router.use(dashboardRouter)

export default router