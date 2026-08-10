import bcrypt
  from 'bcrypt'

import usersRepository
  from '../repositories/usersRepository.js'

import ValidationError
  from '../errors/ValidationError.js'

import UnauthorizedError
  from '../errors/UnauthorizedError.js'

  import {
    generateToken,
  } from '../utils/jwt.js'

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
            await this.validarCredenciales(
                email,
                password
            )

        const token =
            this.generarToken(
                user
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

    async validarCredenciales(
        email,
        password
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

        return user

    },

    generarToken(
        user
    ) {

        return generateToken({

            id: user.id,

            name: user.name,

            email: user.email,

            role: user.role,
        })
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