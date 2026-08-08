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