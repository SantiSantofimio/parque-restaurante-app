import type {
  AdminUser,
} from '@/app/services/admin'

import styles
  from './AdminHeader.module.css'

interface Props {
  user: AdminUser
}

export default function AdminHeader({
  user,
}: Props) {

  return (
    <header
      className={
        styles.header
      }
    >

      <div>
        <span
          className={
            styles.eyebrow
          }
        >
          PANEL DE CONTROL
        </span>

        <h1>
          Administración
        </h1>
      </div>

      <div
        className={
          styles.user
        }
      >
        <div
          className={
            styles.userInfo
          }
        >
          <strong>
            {user.name}
          </strong>

          <span>
            Administrador
          </span>
        </div>

        <div
          className={
            styles.avatar
          }
        >
          {user.name
            .charAt(0)
            .toUpperCase()}
        </div>
      </div>

    </header>
  )
}