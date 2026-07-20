'use client'

import {
  useEffect,
  useState,
} from 'react'
import {
  useRouter,
} from 'next/navigation'
import type {
  Usuario,
} from '@/types/mesas'

export function useAuth() {
  const router =
    useRouter()

  const [
    user,
    setUser,
  ] =
    useState<Usuario | null>(
      null
    )

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  useEffect(() => {
    const checkAuth =
      async () => {
        const savedUser =
          localStorage.getItem(
            'user'
          )

        if (!savedUser) {

          setLoading(false)

          router.push(
            '/auth/login'
          )

          return
          
        }

        setUser(
          JSON.parse(
            savedUser
          )
        )

        setLoading(
          false
        )
      }

    void checkAuth()
  }, [router])

  return {
    user,
    loading,
  }
}