import BaseRepository
  from './BaseRepository.js'

import {
  TICKETS_FILE,
} from '../config/paths.js'

class TicketsRepository
  extends BaseRepository {

  constructor() {

    super(
      TICKETS_FILE
    )

  }

}

const ticketsRepository = new TicketsRepository()

export default ticketsRepository