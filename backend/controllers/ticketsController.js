import ticketsService
    from '../services/ticketsService.js'

export function obtenerTickets(
    req,
    res
) {

    const tickets =
        ticketsService.obtenerTicketsUsuario(
            req.user.id
        )

    return res.json(
        tickets
    )

}

export function comprarTicket(
    req,
    res
) {

    const resultado =
        ticketsService.comprarTicket(
            req.user,
            req.body
        )

    return res
        .status(201)
        .json(
            resultado
        )

}