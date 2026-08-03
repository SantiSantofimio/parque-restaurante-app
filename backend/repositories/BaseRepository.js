import {
  readJsonFile,
  writeJsonFile,
} from '../utils/jsonStorage.js'

export default class BaseRepository {

  constructor(
    filePath
  ) {

    this.filePath =
      filePath

  }

  getAll() {

    return readJsonFile(
      this.filePath
    )

  }

  findById(
    id
  ) {

    return this
      .getAll()
      .find(
        item =>
          item.id === id
      )

  }

  create(
    entity
  ) {

    const entities =
      this.getAll()

    entities.push(
      entity
    )

    writeJsonFile(
      this.filePath,
      entities
    )

    return entity

  }

  update(
    updatedEntity
  ) {

    const entities =
      this.getAll()

    const index =
      entities.findIndex(
        entity =>
          entity.id ===
          updatedEntity.id
      )

    if (
      index === -1
    ) {
      return null
    }

    entities[index] =
      updatedEntity

    writeJsonFile(
      this.filePath,
      entities
    )

    return updatedEntity

  }

  delete(
    id
  ) {

    const entities =
      this.getAll()

    const filtered =
      entities.filter(
        entity =>
          entity.id !== id
      )

    writeJsonFile(
      this.filePath,
      filtered
    )

  }

  saveAll(
    entities
  ) {

    writeJsonFile(
      this.filePath,
      entities
    )

  }

}