import MesaDetalleClient from './MesaDetalleClient'

export function generateStaticParams() {
  return [
    { mesaId: 'mesa-1' },
    { mesaId: 'mesa-2' },
    { mesaId: 'mesa-3' },
    { mesaId: 'mesa-4' },
    { mesaId: 'mesa-5' },
    { mesaId: 'mesa-6' },
    { mesaId: 'mesa-7' },
    { mesaId: 'mesa-8' },
    { mesaId: 'mesa-9' },
    { mesaId: 'mesa-10' },
  ]
}

export default function MesaPage() {
  return <MesaDetalleClient />
}