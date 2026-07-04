// Inline fallback for getAuthHeaders to avoid dependency on ./api module.
// Adjust or remove this fallback if a shared api module is available.
function getAuthHeaders(): Record<string, string> {
    return { 'Content-Type': 'application/json' }
}

const API_URL =
'http://localhost:4000/api/content'

export interface Banner {

    id:number

    title:string

    subtitle:string

    image:string

    emoji:string

    actionText:string

    actionRoute:string

    colorStart:string

    colorEnd:string

    active:boolean
}

export interface Service {

    id:number

    title:string

    icon:string

    route:string
}

export interface Promotion{

    id:number

    title:string

    description:string

    image:string
}

export interface News{

    id:number

    title:string

    description:string
}

export interface Content{

    banners:Banner[]

    services:Service[]

    promotions:Promotion[]

    news:News[]
}

export async function obtenerContenido(){

    const res=await fetch(API_URL,{
        headers:getAuthHeaders()
    })

    if(!res.ok){

        throw new Error(
            'Error obteniendo contenido'
        )

    }

    return res.json() as Promise<Content>

}