import mesasService from '../services/mesasService.js'

export function obtenerMesas(
  req,
  res
) {

    const mesas = mesasService.obtenerMesas(
        req.query.personas
    )

    return res.json(mesas)

}

export function obtenerMesa(
  req,
  res
) {

    try {

        const mesa = mesasService.obtenerMesa(
            req.params.mesaId
        )

        return res.json(
            mesa
        )

    } catch (error) {

        const mensaje = error.message

        let status = 400

        if (mensaje === 'Mesa no encontrada') {
            status = 404
        }

        return res
            .status(status)
            .json({
                error: error.message,
            })

    }

}

export function entrarAMesa(
  req,
  res
) {

    try {

        const resultado = mesasService.entrarAMesa(
            req.params.mesaId,
            req.user
        )
        
        return res.json(
            resultado
        )

    } catch (error) {

        const mensaje = error.message

        let status = 400

        if (
            mensaje ===
            'Usuario no autenticado'
        ) {

            status = 401

        } else if (
            mensaje ===
            'Mesa no encontrada'
        ) {

            status = 404

        }

        return res 
            .status(status)
            .json({
                error: mensaje,
            })
        
    }
}

export function salirDeMesa(
  req,
  res
) {

    try {

        const resultado = mesasService.salirDeMesa(
            req.params.mesaId,
            req.user
        )

        return res.json(
            resultado
        )

    } catch (error) {

        const mensaje = error.mensaje

        let status = 400

        if (
            mensaje ===
            'Usuario no autenticado'
        ) {

            status = 401

        } else if (
            mensaje ===
            'Mesa no encontrada'
        ) {

            status = 404

        }

        return res 
            .status(status)
            .json({
                error: mensaje,
            })
        
    }
}

export function confirmarPedido(
  req,
  res
) {

    try {

        const resultado = mesasService.confirmarPedido(
            req.params.mesaId,
            req.user,
            req.body.productos
        )

        return res
            .status(201)
            .json(resultado)

    } catch (error) {

        const mensaje = error.message

        let status = 400

        switch (mensaje) {
            case 'Usuario no autenticado':
                status = 401
                break

            case 'Mesa no encontrada':
                status = 404
                break

            case 'No perteneces a esta mesa':
                status = 403
                break

            default:
                status = 400
                break
        }

        return res
            .status(status)
            .json({
                error: mensaje,
            })
    }
}