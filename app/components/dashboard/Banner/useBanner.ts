'use client'

import { useEffect, useState } from 'react'

import type { BannerItem } from './types'

export default function useBanner() {

  const [banners, setBanners] =
    useState<BannerItem[]>([])

  useEffect(() => {

    async function load() {

      // Más adelante esto vendrá del backend.

      setBanners([
        {
          id: '1',

          title: 'Piscina Yuma',

          subtitle:
            'Compra tus entradas sin filas.',

          emoji: '🏊',

          actionText: 'Comprar',

          actionRoute: '/tickets',

          colorStart: '#08945b',

          colorEnd: '#3fe388',

          active: true,
        },

        {
          id: '2',

          title: 'Restaurante',

          subtitle:
            'Reserva una mesa.',

          emoji: '🍽',

          actionText: 'Reservar',

          actionRoute: '/mesas',

          colorStart: '#f57c00',

          colorEnd: '#ffb74d',

          active: true,
        },

        {
          id: '3',

          title: 'Tours',

          subtitle:
            'Descubre nuestros recorridos.',

          emoji: '🌳',

          actionText: 'Explorar',

          actionRoute: '/recorridos',

          colorStart: '#00695c',

          colorEnd: '#26a69a',

          active: true,
        },
      ])

    }

    load()

  }, [])

  return banners

}