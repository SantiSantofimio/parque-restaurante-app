import usersRepository
  from '../repositories/usersRepository.js'

import ValidationError
  from '../errors/ValidationError.js'

import ForbiddenError
  from '../errors/ForbiddenError.js'

import NotFoundError
  from '../errors/NotFoundError.js'

import {
  ROLES,
} from '../config/roles.js'


const adminUsersService = {

  obtenerUsuarios() {

    const users =
      usersRepository.getAll()

    return users.map(
      user => ({
        id:
          user.id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role ||
          ROLES.CUSTOMER,

        puntos:
          user.puntos ||
          0,

        createdAt:
          user.createdAt ||
          null,

        active:
          user.active !== false,
      })
    )

  },


  cambiarRol(
    actor,
    targetUserId,
    nuevoRol
  ) {

    this.validarRol(
      nuevoRol
    )

    const actorRole =
      actor.role ||
      ROLES.CUSTOMER

    if (
      String(actor.id) ===
      String(targetUserId)
    ) {

      throw new ForbiddenError(
        'No puedes modificar tu propio rol'
      )

    }

    const targetUser =
      usersRepository.findById(
        targetUserId
      )

    if (!targetUser) {

      throw new NotFoundError(
        'Usuario no encontrado'
      )

    }

    const targetRole =
      targetUser.role ||
      ROLES.CUSTOMER


    this.validarJerarquia(
      actorRole,
      targetRole,
      nuevoRol
    )


    targetUser.role =
      nuevoRol

    usersRepository.update(
      targetUser
    )

    return this.sanitizarUsuario(
      targetUser
    )

  },


  validarRol(
    role
  ) {

    const rolesValidos =
      Object.values(
        ROLES
      )

    if (
      !rolesValidos.includes(
        role
      )
    ) {

      throw new ValidationError(
        'Rol de usuario inválido'
      )

    }

  },


  validarJerarquia(
    actorRole,
    targetRole,
    nuevoRol
  ) {

    if (
      actorRole ===
      ROLES.SUPERADMIN
    ) {

      return

    }


    if (
      actorRole ===
      ROLES.ADMIN
    ) {

      const rolesPermitidos = [

        ROLES.MANAGER,

        ROLES.EMPLOYEE,

        ROLES.CUSTOMER,

      ]

      if (
        targetRole ===
          ROLES.SUPERADMIN ||
        targetRole ===
          ROLES.ADMIN
      ) {

        throw new ForbiddenError(
          'No puedes modificar usuarios con rango administrativo superior o igual al tuyo'
        )

      }

      if (
        !rolesPermitidos.includes(
          nuevoRol
        )
      ) {

        throw new ForbiddenError(
          'No puedes asignar este rol'
        )

      }

      return

    }


    throw new ForbiddenError(
      'No tienes permisos para modificar roles'
    )

  },


  sanitizarUsuario(
    user
  ) {

    return {

      id:
        user.id,

      name:
        user.name,

      email:
        user.email,

      role:
        user.role ||
        ROLES.CUSTOMER,

      puntos:
        user.puntos ||
        0,

      createdAt:
        user.createdAt ||
        null,

      active:
        user.active !== false,

    }

  },

  cambiarEstado(
    actor,
    targetUserId,
    activo
    ) {

    const actorRole =
        actor.role ||
        ROLES.CUSTOMER

    const targetUser =
        usersRepository.findById(
        targetUserId
        )

    if (!targetUser) {

        throw new NotFoundError(
        'Usuario no encontrado'
        )

    }

    if (
        String(actor.id) ===
        String(targetUserId)
    ) {

        throw new ForbiddenError(
        'No puedes desactivar tu propia cuenta'
        )

    }

    const targetRole =
        targetUser.role ||
        ROLES.CUSTOMER


    if (
        actorRole === ROLES.ADMIN &&
        (
        targetRole === ROLES.ADMIN ||
        targetRole === ROLES.SUPERADMIN
        )
    ) {

        throw new ForbiddenError(
        'No puedes modificar el estado de un usuario administrativo superior o igual a tu rango'
        )

    }


    if (
        actorRole !== ROLES.ADMIN &&
        actorRole !== ROLES.SUPERADMIN
    ) {

        throw new ForbiddenError(
        'No tienes permisos para modificar el estado del usuario'
        )

    }


    targetUser.active =
        Boolean(activo)

    usersRepository.update(
        targetUser
    )

    return this.sanitizarUsuario(
        targetUser
    )

    },

}


export default adminUsersService