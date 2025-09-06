"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, User, DollarSign, Calendar, Bell, FileText, Users, BarChart3, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"

interface SidebarProps {
  className?: string
}

const menuItems = {
  employee: [
    { icon: Home, label: "Dashboard", href: "/employee/dashboard" },
    { icon: User, label: "My Profile", href: "/employee/profile" },
    { icon: DollarSign, label: "My Salary", href: "/employee/salary" },
    { icon: Calendar, label: "My Leaves", href: "/employee/leaves" },
    { icon: Bell, label: "Notifications", href: "/employee/notifications" },
    { icon: FileText, label: "Download Slip", href: "/employee/salary-slip" },
  ],
  admin: [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Employee Management", href: "/admin/employees" },
    { icon: DollarSign, label: "Payroll Management", href: "/admin/payroll" },
    { icon: Calendar, label: "Leave Management", href: "/admin/leaves" },
    { icon: BarChart3, label: "Reports & Analytics", href: "/admin/reports" },
    { icon: Bell, label: "Announcements", href: "/admin/announcements" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ],
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const user = getCurrentUser()

  if (!user) return null

  const items = menuItems[user.role] || []

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-4 px-4">
            <h2 className="text-lg font-semibold text-primary">PayrollPro</h2>
            <p className="text-sm text-muted-foreground capitalize">{user.role} Portal</p>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-1">
              {items.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
