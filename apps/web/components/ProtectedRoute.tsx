'use client'

import { AuthContext, AuthContextType } from '@repo/core'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'
import { ROUTES } from '../constants/routes'

type ProtectedRouteProps = {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useContext(AuthContext) as AuthContextType
  const router = useRouter()

  useEffect(() => {
    if (!user && !loading) {
      router.push(ROUTES.LOGIN)
    }
  }, [user, loading])

  return children
}

export default ProtectedRoute
