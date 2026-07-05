import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', (req, res) => {
  res.json({
    banners: [
      {
        id: '1',
        title: 'Bienvenido a Yuma',
        subtitle: 'Naturaleza, diversión y descanso.',
        image: '/images/banner1.jpg',
        actionText: 'Comprar entradas',
        actionRoute: '/tickets',
      },
    ],

    services: [
      {
        id: '1',
        title: 'Piscina',
        icon: '🏊',
        route: '/tickets',
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
        image: '/promo1.jpg',
      },
      {
        id: '2',
        title: '20% Restaurante',
        description: 'Comprando entradas',
        image: '/promo2.jpg',
      },
    ],
  })
})

export default router