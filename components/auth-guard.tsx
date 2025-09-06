"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  email: string
  role: string
  name: string
  employeeId: string
  isProfileComplete: boolean
}

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
  requireProfileComplete?: boolean
}

export function AuthGuard({ children, allowedRoles, requireProfileComplete = false }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")

    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)

    // Check if user role is allowed
    if (allowedRoles && !allowedRoles.includes(parsedUser.role)) {
      router.push("/auth/login")
      return
    }

    // Check if profile completion is required
    if (requireProfileComplete && !parsedUser.isProfileComplete) {
      router.push(`/${parsedUser.role}/profile/complete`)
      return
    }

    setUser(parsedUser)
    setIsLoading(false)
  }, [router, allowedRoles, requireProfileComplete])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
