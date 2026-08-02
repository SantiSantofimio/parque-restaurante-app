import {
  USERS_FILE,
} from '../config/paths.js'

import {
  readJsonFile,
  writeJsonFile,
} from '../utils/jsonStorage.js'

class UsersRepository {

  getAll() {

    return readJsonFile(
      USERS_FILE
    )

  }

  findById(
    id
  ) {

    return this
      .getAll()
      .find(
        user =>
          user.id === id
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

  save(
    user
  ) {

    const users =
      this.getAll()

    users.push(
      user
    )

    writeJsonFile(
      USERS_FILE,
      users
    )

    return user

  }

  update(
    updatedUser
  ) {

    const users =
      this.getAll()

    const index =
      users.findIndex(
        user =>
          user.id ===
          updatedUser.id
      )

    if (
      index === -1
    ) {
      return null
    }

    users[index] =
      updatedUser

    writeJsonFile(
      USERS_FILE,
      users
    )

    return updatedUser

  }

  delete(
    id
  ) {

    const users =
      this.getAll()

    const filtered =
      users.filter(
        user =>
          user.id !== id
      )

    writeJsonFile(
      USERS_FILE,
      filtered
    )

  }

}

const usersRepository = new UsersRepository()

export default usersRepository