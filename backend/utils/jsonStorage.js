import fs from 'fs'

// ============================
// Leer archivo JSON
// ============================

export function readJsonFile(
  filePath
) {

  if (
    !fs.existsSync(
      filePath
    )
  ) {
    return []
  }

  const raw =
    fs.readFileSync(
      filePath,
      'utf-8'
    )

  if (
    !raw.trim()
  ) {
    return []
  }

  return JSON.parse(
    raw
  )

}

// ============================
// Guardar archivo JSON
// ============================

export function writeJsonFile(
  filePath,
  data
) {

  fs.writeFileSync(

    filePath,

    JSON.stringify(

      data,

      null,

      2

    )

  )

}