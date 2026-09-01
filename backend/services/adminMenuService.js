import menuRepository
  from '../repositories/menuRepository.js'

import ValidationError
  from '../errors/ValidationError.js'

import NotFoundError
  from '../errors/NotFoundError.js'

const adminMenuService = {

  obtenerMenu() {

    const productos =
      menuRepository.getAll()

    return {

      productos,

      total:
        productos.length,

    }

  },


  crearProducto(
    datos
  ) {

    if (
      !datos ||
      typeof datos !== 'object'
    ) {

      throw new ValidationError(
        'Los datos del producto son obligatorios'
      )

    }


    const categoria =
      typeof datos.categoria === 'string'
        ? datos.categoria.trim()
        : ''

    const nombre =
      typeof datos.nombre === 'string'
        ? datos.nombre.trim()
        : ''

    const descripcion =
      typeof datos.descripcion === 'string'
        ? datos.descripcion.trim()
        : ''

    const imagen =
      typeof datos.imagen === 'string'
        ? datos.imagen.trim()
        : ''


    if (!categoria) {

      throw new ValidationError(
        'La categoría es obligatoria'
      )

    }


    if (!nombre) {

      throw new ValidationError(
        'El nombre del producto es obligatorio'
      )

    }


    if (!descripcion) {

      throw new ValidationError(
        'La descripción es obligatoria'
      )

    }


    const precio =
      Number(
        datos.precio
      )


    if (
      !Number.isFinite(precio) ||
      precio <= 0
    ) {

      throw new ValidationError(
        'El precio debe ser un número mayor que 0'
      )

    }


    const disponible =
      datos.disponible === undefined
        ? true
        : datos.disponible


    if (
      typeof disponible !==
      'boolean'
    ) {

      throw new ValidationError(
        'El estado de disponibilidad debe ser booleano'
      )

    }


    const productos =
      menuRepository.getAll()


    const productoDuplicado =
      productos.some(
        producto =>
          String(
            producto.categoria || ''
          ).trim().toLowerCase() ===
          categoria.toLowerCase() &&
          String(
            producto.nombre || ''
          ).trim().toLowerCase() ===
          nombre.toLowerCase()
      )


    if (
      productoDuplicado
    ) {

      throw new ValidationError(
        'Ya existe un producto con ese nombre en esta categoría'
      )

    }


    const idsNumericos =
      productos
        .map(
          producto =>
            Number(
              producto.id
            )
        )
        .filter(
          id =>
            Number.isInteger(id)
        )


    const siguienteId =
      idsNumericos.length > 0
        ? Math.max(
            ...idsNumericos
          ) + 1
        : 1


    const producto = {

      id:
        String(
          siguienteId
        ),

      categoria,

      nombre,

      descripcion,

      precio,

      imagen,

      disponible,

    }


    return menuRepository.create(
      producto
    )

  },

    actualizarProducto(
    productId,
    datos
  ) {

    const producto =
      menuRepository.findById(
        productId
      )

    if (!producto) {

      throw new NotFoundError(
        'Producto no encontrado'
      )

    }

    if (
      !datos ||
      typeof datos !== 'object'
    ) {

      throw new ValidationError(
        'Los datos del producto son obligatorios'
      )

    }

    const camposPermitidos = [
      'categoria',
      'nombre',
      'descripcion',
      'precio',
      'imagen',
    ]

    const camposRecibidos =
      Object.keys(datos)

    const camposInvalidos =
      camposRecibidos.filter(
        campo =>
          !camposPermitidos.includes(
            campo
          )
      )

    if (
      camposInvalidos.length > 0
    ) {

      throw new ValidationError(
        `Campos no permitidos: ${camposInvalidos.join(', ')}`
      )

    }

    if (
      Object.prototype.hasOwnProperty.call(
        datos,
        'categoria'
      )
    ) {

      if (
        typeof datos.categoria !==
        'string' ||
        !datos.categoria.trim()
      ) {

        throw new ValidationError(
          'La categoría no puede estar vacía'
        )

      }

      producto.categoria =
        datos.categoria.trim()

    }

    if (
      Object.prototype.hasOwnProperty.call(
        datos,
        'nombre'
      )
    ) {

      if (
        typeof datos.nombre !==
        'string' ||
        !datos.nombre.trim()
      ) {

        throw new ValidationError(
          'El nombre del producto no puede estar vacío'
        )

      }

      producto.nombre =
        datos.nombre.trim()

    }

    if (
      Object.prototype.hasOwnProperty.call(
        datos,
        'descripcion'
      )
    ) {

      if (
        typeof datos.descripcion !==
        'string' ||
        !datos.descripcion.trim()
      ) {

        throw new ValidationError(
          'La descripción no puede estar vacía'
        )

      }

      producto.descripcion =
        datos.descripcion.trim()

    }

    if (
      Object.prototype.hasOwnProperty.call(
        datos,
        'precio'
      )
    ) {

      const precio =
        Number(
          datos.precio
        )

      if (
        !Number.isFinite(precio) ||
        precio <= 0
      ) {

        throw new ValidationError(
          'El precio debe ser un número mayor que 0'
        )

      }

      producto.precio =
        precio

    }

    if (
      Object.prototype.hasOwnProperty.call(
        datos,
        'imagen'
      )
    ) {

      if (
        typeof datos.imagen !==
        'string'
      ) {

        throw new ValidationError(
          'La imagen debe ser una cadena de texto'
        )

      }

      producto.imagen =
        datos.imagen.trim()

    }

    const productos =
      menuRepository.getAll()

    const productoDuplicado =
      productos.some(
        otroProducto =>
          String(
            otroProducto.id
          ) !== String(
            productId
          ) &&
          String(
            otroProducto.categoria || ''
          ).trim().toLowerCase() ===
          String(
            producto.categoria || ''
          ).trim().toLowerCase() &&
          String(
            otroProducto.nombre || ''
          ).trim().toLowerCase() ===
          String(
            producto.nombre || ''
          ).trim().toLowerCase()
      )

    if (
      productoDuplicado
    ) {

      throw new ValidationError(
        'Ya existe otro producto con ese nombre en esta categoría'
      )

    }

    return menuRepository.update(
      producto
    )

  },

    cambiarDisponibilidad(
    productId,
    disponible
  ) {

    const producto =
      menuRepository.findById(
        productId
      )

    if (!producto) {

      throw new NotFoundError(
        'Producto no encontrado'
      )

    }

    if (
      typeof disponible !==
      'boolean'
    ) {

      throw new ValidationError(
        'La disponibilidad debe ser un valor booleano'
      )

    }

    producto.disponible =
      disponible

    return menuRepository.update(
      producto
    )

  },

}


export default
  adminMenuService