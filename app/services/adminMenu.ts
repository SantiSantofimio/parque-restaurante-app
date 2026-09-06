import {
  apiRequest,
} from './api'


// ========================================
// TIPOS
// ========================================

export type AdminMenuProduct = {

  id:
    number | string

  categoria:
    string

  nombre:
    string

  descripcion:
    string

  precio:
    number

  imagen:
    string

  disponible:
    boolean

}


// ========================================
// RESPUESTA DEL MENÚ
// ========================================

export type AdminMenuResponse = {

  productos:
    AdminMenuProduct[]

  total:
    number

}


// ========================================
// CREAR PRODUCTO
// ========================================

export type CrearProductoData = {

  categoria:
    string

  nombre:
    string

  descripcion:
    string

  precio:
    number

  imagen:
    string

  disponible:
    boolean

}


// ========================================
// ACTUALIZAR PRODUCTO
// ========================================

export type ActualizarProductoData = {

  categoria?:
    string

  nombre?:
    string

  descripcion?:
    string

  precio?:
    number

  imagen?:
    string

}


// ========================================
// OBTENER MENÚ
// ========================================

export async function obtenerMenuAdmin() {

  return apiRequest<AdminMenuResponse>(
    '/admin/menu'
  )

}


// ========================================
// CREAR PRODUCTO
// ========================================

export async function crearProductoAdmin(
  producto:
    CrearProductoData
) {

  return apiRequest<{
    message:
      string

    producto:
      AdminMenuProduct

  }>(
    '/admin/menu',
    {
      method:
        'POST',

      body:
        JSON.stringify(
          producto
        ),
    }
  )

}


// ========================================
// ACTUALIZAR PRODUCTO
// ========================================

export async function actualizarProductoAdmin(
  productId:
    number | string,

  producto:
    ActualizarProductoData
) {

  return apiRequest<{
    message:
      string

    producto:
      AdminMenuProduct

  }>(
    `/admin/menu/${productId}`,
    {
      method:
        'PATCH',

      body:
        JSON.stringify(
          producto
        ),
    }
  )

}


// ========================================
// CAMBIAR DISPONIBILIDAD
// ========================================

export async function cambiarDisponibilidadAdmin(
  productId:
    number | string,

  disponible:
    boolean
) {

  return apiRequest<{
    message:
      string

    producto:
      AdminMenuProduct

  }>(
    `/admin/menu/${productId}/status`,
    {
      method:
        'PATCH',

      body:
        JSON.stringify({
          disponible,
        }),
    }
  )

}