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

export const MESAS_FILE =
  path.join(
    __dirname,
    '../../data/mesas.json'
  )

export const USERS_FILE =
  path.join(
    __dirname,
    '../../data/users.json'
  )

export const FACTURAS_FILE =
  path.join(
    __dirname,
    '../../data/facturas.json'
  )