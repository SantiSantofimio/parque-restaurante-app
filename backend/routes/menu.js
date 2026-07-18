import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MENU_FILE = path.join(
  __dirname,
  '../content/menu.json'
)

function readMenu() {
  if (!fs.existsSync(MENU_FILE)) return []

  const raw = fs.readFileSync(
    MENU_FILE,
    'utf-8'
  )

  if (!raw.trim()) return []

  return JSON.parse(raw)
}

router.get('/', (req, res) => {
  const menu = readMenu()

  res.json(menu)
})

export default router