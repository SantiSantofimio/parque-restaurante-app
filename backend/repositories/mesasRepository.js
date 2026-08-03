import BaseRepository from './BaseRepository.js'

import {
  MESAS_FILE,
} from '../config/paths.js'

class MesasRepository
  extends BaseRepository {

  constructor() {

    super(
      MESAS_FILE
    )

  }

  findByUserId(
    userId
  ) {

    return this
      .getAll()
      .find(
        mesa =>
          mesa.usuarios?.some(
            usuario =>
              usuario.id ===
              userId
          )
      )

  }

  findAvailable(
    personas
  ) {

    return this
      .getAll()
      .filter(
        mesa => {

          const ocupados =
            mesa.usuarios?.length || 0

          return (
            mesa.capacidad -
            ocupados >=
            personas
          )

        }
      )

  }

  exists(
    mesaId
  ) {

    return Boolean(
      this.findById(
        mesaId
      )
    )

  }

}

const mesasRepository =
  new MesasRepository()

export default
  mesasRepository