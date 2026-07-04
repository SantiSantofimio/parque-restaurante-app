import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA = path.join(__dirname, '../data')

function read(file) {
  return JSON.parse(
    fs.readFileSync(
      path.join(DATA, file),
      'utf8'
    )
  )
}

router.get('/', (req, res) => {

  res.json({

    banners: read('banners.json'),

    services: read('services.json'),

    promotions: read('promotions.json'),

    news: read('news.json')

  })

})

export default router