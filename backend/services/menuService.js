import menuRepository
  from '../repositories/menuRepository.js'

const menuService = {

  obtenerMenu() {

    return menuRepository.getAll()

  },

}

export default menuService