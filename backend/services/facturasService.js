import facturasRepository
  from '../repositories/facturasRepository.js'

const facturasService = {

  obtenerFacturasUsuario(
    userId
  ) {

    const facturas =
      facturasRepository.getAll()

    return facturas.filter(
      factura =>
        factura.user?.id ===
        userId
    )

  },

}

export default facturasService