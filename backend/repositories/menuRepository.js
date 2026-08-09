import BaseRepository
  from './BaseRepository.js'

import {
  MENU_FILE,
} from '../config/paths.js'

class MenuRepository
  extends BaseRepository {

  constructor() {

    super(
      MENU_FILE
    )

  }

}

const menuRepository =
  new MenuRepository()

export default
  menuRepository