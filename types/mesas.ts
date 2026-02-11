export type Usuario = {
    id: number
    name: string
}

export type Mesa = {
    id: string
    capacidad: number
    ocupada: boolean
    usuarios: Usuario[]
}