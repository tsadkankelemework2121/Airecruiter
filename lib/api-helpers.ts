// Helper functions for API calls with authentication

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
  userId?: string
): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    ...(userId && { "x-user-id": userId }),
    ...options.headers,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

export function getUserId(): string | null {
  if (typeof window === "undefined") return null
  const storedUser = localStorage.getItem("user")
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      return user.id || null
    } catch {
      return null
    }
  }
  return null
}

