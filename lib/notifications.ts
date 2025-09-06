export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
  actionUrl?: string
}

// Sample notifications
export const sampleNotifications: Notification[] = [
  {
    id: "NOTIF001",
    title: "Salary Credited",
    message: "Your December salary has been credited to your account.",
    type: "success",
    timestamp: "2024-12-20T10:30:00Z",
    read: false,
  },
  {
    id: "NOTIF002",
    title: "Leave Request Approved",
    message: "Your leave request for Dec 25-26 has been approved by your supervisor.",
    type: "success",
    timestamp: "2024-12-19T14:15:00Z",
    read: false,
  },
  {
    id: "NOTIF003",
    title: "System Maintenance",
    message: "Scheduled maintenance on Dec 31st from 2:00 AM to 4:00 AM.",
    type: "warning",
    timestamp: "2024-12-18T09:00:00Z",
    read: true,
  },
  {
    id: "NOTIF004",
    title: "Profile Update Required",
    message: "Please update your emergency contact information.",
    type: "info",
    timestamp: "2024-12-17T16:45:00Z",
    read: true,
  },
]

export function getNotificationIcon(type: Notification["type"]) {
  const icons = {
    info: "💡",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  }
  return icons[type]
}

export function getNotificationColor(type: Notification["type"]) {
  const colors = {
    info: "bg-blue-100 text-blue-800 border-blue-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
  }
  return colors[type]
}

export function formatNotificationTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    return "Just now"
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}
