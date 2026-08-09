import path from 'path'

import {
  fileURLToPath,
} from 'url'

const __filename =
  fileURLToPath(
    import.meta.url
  )

const __dirname =
  path.dirname(
    __filename
  )

export const DATA_PATH =
  path.join(
    __dirname,
    '../data'
  )

export const CONTENT_PATH =
  path.join(
    __dirname,
    '../content'
  )

export const BANNERS_FILE =
  path.join(
    CONTENT_PATH,
    'banners.json'
  )

export const SERVICES_FILE =
  path.join(
    CONTENT_PATH,
    'services.json'
  )

export const PROMOTIONS_FILE =
  path.join(
    CONTENT_PATH,
    'promotions.json'
  )

export const NEWS_FILE =
  path.join(
    CONTENT_PATH,
    'news.json'
  )

export const EVENTS_FILE =
  path.join(
    CONTENT_PATH,
    'events.json'
  )

export const TOURS_FILE =
  path.join(
    CONTENT_PATH,
    'tours.json'
  )

export const RESTAURANT_FILE =
  path.join(
    CONTENT_PATH,
    'restaurant.json'
  )

export const USERS_FILE =
  path.join(
    DATA_PATH,
    'users.json'
  )

export const MESAS_FILE =
  path.join(
    DATA_PATH,
    'mesas.json'
  )

export const FACTURAS_FILE =
  path.join(
    DATA_PATH,
    'facturas.json'
  )

export const TICKETS_FILE =
  path.join(
    DATA_PATH,
    'tickets.json'
  )

export const MENU_FILE =
  path.join(
    CONTENT_PATH,
    'menu.json'
  )

export const POINTS_FILE =
  path.join(
    DATA_PATH,
    'puntos.json'
  )