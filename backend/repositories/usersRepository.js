import BaseRepository from './BaseRepository.js'

import {
  USERS_FILE,
} from '../config/paths.js'

class UsersRepository
  extends BaseRepository {

  constructor() {

    super(
      USERS_FILE
    )

  }

  findByEmail(
    email
  ) {

    return this
      .getAll()
      .find(
        user =>
          user.email === email
      )

  }

  findById(
    id
  ) {

    return this
      .getAll()
      .find(
        user => 
          String(user.id) === String(id)
      )
  }

}

const usersRepository =
  new UsersRepository()

export default
  usersRepository