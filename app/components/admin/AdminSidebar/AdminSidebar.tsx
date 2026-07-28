'use client'

import {
  usePathname,
  useRouter,
} from 'next/navigation'

import {
  appPath,
} from '@/app/lib/paths'

import styles
  from './AdminSidebar.module.css'


const navigation = [
  {
    label: 'Dashboard',
    icon: '▦',
    route: '/admin/',
  },
  {
    label: 'Restaurante',
    icon: '🍽',
    route: '/admin/restaurante/',
  },
  {
    label: 'Mesas y pedidos',
    icon: '▣',
    route: '/admin/mesas/',
  },
  {
    label: 'Clientes',
    icon: '♟',
    route: '/admin/clientes/',
  },
  {
    label: 'Tickets',
    icon: '🎟',
    route: '/admin/tickets/',
  },
  {
    label: 'Facturación',
    icon: '▤',
    route: '/admin/facturacion/',
  },
]

export default function AdminSidebar() {

  const router =
    useRouter() 

  const pathname =
    usePathname()

  return (
    <aside
      className={
        styles.sidebar
      }
    >

      <div
        className={
          styles.brand
        }
      >
        <div
          className={
            styles.logo
          }
        >
          Y
        </div>

        <div>
          <strong>
            Parque Yuma
          </strong>

          <span>
            Administración
          </span>
        </div>
      </div>

      <nav
        className={
          styles.navigation
        }
      >
        {navigation.map(
          item => {

            const active =
              pathname ===
              item.route

            return (
              <button
                key={
                  item.route
                }
                type="button"
                className={`
                  ${styles.navItem}
                  ${
                    active
                      ? styles.active
                      : ''
                  }
                `}
                onClick={() =>
                  router.push(
                    appPath(
                      item.route
                    )
                  )
                }
              >

                <span
                  className={
                    styles.icon
                  }
                >
                  {item.icon}
                </span>

                {item.label}

              </button>
            )
          }
        )}
      </nav>

      <div
        className={
          styles.footer
        }
      >
        <button
          type="button"
          onClick={() =>
            router.push(
              appPath(
                '/dashboard/'
              )
            )
          }
        >
          ← Volver al parque
        </button>
      </div>

    </aside>
  )
}