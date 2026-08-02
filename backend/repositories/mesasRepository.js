import {
  MESAS_FILE,
} from '../config/paths.js'

import {
  readJsonFile,
  writeJsonFile,
} from '../utils/jsonStorage.js'

class MesasRepository {

  getAll() {

    return readJsonFile(
      MESAS_FILE
    )

  }

  findById(
    id
  ) {

    return this
      .getAll()
      .find(
        mesa =>
          mesa.id === id
      )

  }

  saveAll(
    mesas
  ) {

    writeJsonFile(
      MESAS_FILE,
      mesas
    )

  }

  create(
    mesa
  ) {

    const mesas =
      this.getAll()

    mesas.push(
      mesa
    )

    this.saveAll(
      mesas
    )

    return mesa

  }

  update(
    updatedMesa
  ) {

    const mesas =
      this.getAll()

    const index =
      mesas.findIndex(
        mesa =>
          mesa.id ===
          updatedMesa.id
      )

    if (
      index === -1
    ) {
      return null
    }

    mesas[index] =
      updatedMesa

    this.saveAll(
      mesas
    )

    return updatedMesa

  }

  delete(
    id
  ) {

    const mesas =
      this.getAll()

    const filtered =
      mesas.filter(
        mesa =>
          mesa.id !== id
      )

    this.saveAll(
      filtered
    )

  }

}

const mesasRepository =
  new MesasRepository()

export default
  mesasRepository