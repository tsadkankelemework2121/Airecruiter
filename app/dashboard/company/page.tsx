"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import CompanyDashboard from "@/Components/Dahboards/companydashboard"

export default function CompanyDashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/signin")
      } else if (user?.role !== "company") {
        // Redirect to appropriate dashboard based on role
        if (user?.role === "user") {
          router.push("/dashboard/user")
        } else {
          router.push("/signin")
        }
      }
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "company") {
    return null
  }

  return <CompanyDashboard />
}

