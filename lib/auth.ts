export interface User {
  email: string
  role: "employee" | "admin" // Removed "manager" and "hr" from role types
  name: string
  employeeId: string
  isProfileComplete: boolean
  department?: string
  jobRole?: string
  country?: string
  joinDate?: string
  profilePhoto?: string
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("user")
  return userData ? JSON.parse(userData) : null
}

export function updateUser(updates: Partial<User>): void {
  const currentUser = getCurrentUser()
  if (currentUser) {
    const updatedUser = { ...currentUser, ...updates }
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }
}

export function logout(): void {
  localStorage.removeItem("user")
  window.location.href = "/auth/login"
}

export function hasRole(requiredRoles: string[]): boolean {
  const user = getCurrentUser()
  return user ? requiredRoles.includes(user.role) : false
}
