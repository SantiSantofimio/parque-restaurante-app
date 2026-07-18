import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONTENT_PATH = path.join(__dirname, '../content')
const router = express.Router()

router.use(authMiddleware)

function readContent(file) {
  const filePath = path.join(CONTENT_PATH, file)
  if (!fs.existsSync(filePath)) {
    return []
  }
  const raw = fs.readFileSync(filePath, 'utf8')
  if (!raw.trim()) {
    return []
  }
  return JSON.parse(raw)
}

router.get('/', (req, res) => {
  res.json({
    banners: readContent('banners.json'),
    services: readContent('services.json'),
    promotions: readContent('promotions.json'),
    news: readContent('news.json'),
    events: readContent('events.json'),
    tours: readContent('tours.json'),
    restaurant: readContent('restaurant.json'),
  })
})
    /* banners: [
      {
        id: '1',
        title: 'Piscina Yuma',
        subtitle: 'Compra tus entradas sin hacer filas.',
        button: 'Comprar',
        route: '/tickets',
        emoji: '🏊',
      },
      {
        id: '2',
        title: 'Restaurante',
        subtitle: 'Reserva tu mesa desde la aplicación.',
        button: 'Reservar',
        route: '/mesas',
        emoji: '🍽',
      },
      {
        id: '3',
        title: 'Recorridos ecológicos',
        subtitle: 'Conoce nuestros senderos.',
        button: 'Ver más',
        route: '/recorridos',
        emoji: '🚶',
      },
      {
        id: '4',
        title: 'Bar Yuma',
        subtitle: 'Disfruta bebidas y promociones.',
        button: 'Explorar',
        route: '/bar',
        emoji: '🍹',
      }
    ],

    services: [
      {
        id: '1',
        title: 'Piscina',
        icon: '🏊',
        route: '/piscina',
      },
      {
        id: '2',
        title: 'Restaurante',
        icon: '🍽',
        route: '/mesas',
      },
      {
        id: '3',
        title: 'Bar',
        icon: '🍹',
        route: '/bar',
      },
      {
        id: '4',
        title: 'Recorridos',
        icon: '🚶',
        route: '/recorridos',
      },
    ],

    promotions: [
      {
        id: '1',
        title: '2x1 Piscina',
        description: 'Solo este fin de semana',
        image: '/promos/piscina.jpg',
      },
      {
        id: '2',
        title: '20% Restaurante',
        description: 'Comprando entradas',
        image: '/promos/promocion2.jpg',
      },
      {
        id: '3',
        title: 'Recorrido ecológico',
        description: 'Explora la naturaleza',
        image: '/promos/promocion4.jpg',
      },
      {
        id: '4',
        title: 'Bar Yuma',
        description: 'Promociones en bebidas',
        image: '/promos/promocion3.jpg',
      },
    ], */

export default router