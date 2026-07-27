import { getAuthHeaders } from './api'
import {
  appPath,
} from '@/app/lib/paths'

const API_URL =
'http://localhost:4000/api/menu'

export interface MenuItem{

id:string

categoria:string

nombre:string

descripcion:string

precio:number

imagen:string

disponible:boolean

}

export async function obtenerMenu():Promise<MenuItem[]>{

const res=await fetch(API_URL,{

headers:getAuthHeaders()

})

if(res.status===401){

localStorage.removeItem('token')

window.location.href = appPath('/auth/login/')

throw new Error('Sesión expirada')

}

if(!res.ok){

throw new Error('Error obteniendo menú')

}

return res.json()

}