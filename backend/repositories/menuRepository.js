import {
  MENU_FILE,
} from '../config/paths.js'

import {
  readJsonFile,
} from '../utils/jsonStorage.js'

class MenuRepository {

  getAll() {

    return readJsonFile(
      MENU_FILE
    )

  }

  findById(
    id
  ) {

    return this
      .getAll()
      .find(
        producto =>
          String(producto.id) ===
          String(id)
      )

  }

}

const menuRepository =
  new MenuRepository()

export default menuRepository