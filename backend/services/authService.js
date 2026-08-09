import bcrypt
  from 'bcrypt'

import jwt
  from 'jsonwebtoken'

import usersRepository
  from '../repositories/usersRepository.js'

import ValidationError
  from '../errors/ValidationError.js'

import UnauthorizedError
  from '../errors/UnauthorizedError.js'

const JWT_SECRET =
  process.env.JWT_SECRET

if (!JWT_SECRET) {

  throw new Error(
    'JWT_SECRET no ha sido configurado'
  )

}

const authService = {

    async registrarUsuario(
        datos
    ) {

        const {
            name,
            email,
            password,
        } = datos

        this.validarRegistro(
            name,
            email,
            password
        )

        const existente =
            this.buscarUsuarioPorEmail(
                email
            )

        if (existente) {

            throw new ValidationError(
                'El usuario ya existe'
            )

        }

        const nuevoUsuario =
            await this.crearUsuario(
                name,
                email,
                password
            )

        usersRepository.create(
            nuevoUsuario
        )

        return {

            message:
                'Usuario registrado correctamente',

        }

    },

    async login(
        datos
    ) {

        const {
            email,
            password,
        } = datos

        const user =
            this.validarCredenciales(
                email,
                password
            )

        const token =
            await this.generarToken(
                user,
                password
            )

        return {

            token,

            user: {

                id:
                    user.id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role,

            },

        }

    },

    validarCredenciales(
        email
    ) {

        const user =
            this.buscarUsuarioPorEmail(
                email
            )

        if (!user) {

            throw new UnauthorizedError(
                'Credenciales incorrectas'
            )

        }

        return user

    },

    async generarToken(
        user,
        password
    ) {

        const passwordCorrecta =
            await bcrypt.compare(
                password,
                user.password
            )

        if (!passwordCorrecta) {

            throw new UnauthorizedError(
                'Credenciales incorrectas'
            )

        }

        return jwt.sign(

            {

                id:
                    user.id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role,

            },

            JWT_SECRET,

            {

                expiresIn:
                    '1d',

            }

        )

    },

    validarRegistro(
        name,
        email,
        password
    ) {

        if (
            !name ||
            !email ||
            !password
        ) {

            throw new ValidationError(
                'Todos los campos son obligatorios'
            )

        }

    },

    buscarUsuarioPorEmail(
        email
    ) {

        return usersRepository.findByEmail(
            email
        )

    },

    async crearUsuario(
        name,
        email,
        password
    ) {

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            )

        return {

            id:
                Date.now(),

            name,

            email,

            password:
                hashedPassword,

            role:
                'customer',

            puntos:
                0,

            createdAt:
                new Date()
                    .toISOString(),

        }

    },

}

export default authService