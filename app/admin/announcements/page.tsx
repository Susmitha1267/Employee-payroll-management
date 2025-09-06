"use client"

import type React from "react"

import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Plus, Send, Edit, Trash2, Megaphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Announcement {
  id: string
  title: string
  message: string
  date: string
  type: "info" | "warning" | "success" | "urgent"
  author: string
}

const sampleAnnouncements: Announcement[] = [
  {
    id: "ANN001",
    title: "Holiday Schedule - New Year 2025",
    message:
      "The office will be closed on January 1st, 2025 for New Year's Day. Regular operations will resume on January 2nd.",
    date: "2024-12-20",
    type: "info",
    author: "Administration Team", // Changed "HR Team" to "Administration Team"
  },
  {
    id: "ANN002",
    title: "System Maintenance Scheduled",
    message:
      "Payroll system maintenance is scheduled for December 31st from 2:00 AM to 4:00 AM. Please complete any pending tasks before this time.",
    date: "2024-12-18",
    type: "warning",
    author: "IT Department",
  },
  {
    id: "ANN003",
    title: "December Salary Credited",
    message:
      "December salaries have been successfully credited to all employee accounts. Please check your bank statements.",
    date: "2024-12-15",
    type: "success",
    author: "Finance Team",
  },
]

export default function AdminAnnouncements() {
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>(sampleAnnouncements)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    type: "info" as Announcement["type"],
  })

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()

    const announcement: Announcement = {
      id: `ANN${(announcements.length + 1).toString().padStart(3, "0")}`,
      title: newAnnouncement.title,
      message: newAnnouncement.message,
      date: new Date().toISOString().split("T")[0],
      type: newAnnouncement.type,
      author: "Admin",
    }

    setAnnouncements([announcement, ...announcements])
    setNewAnnouncement({ title: "", message: "", type: "info" })
    setShowCreateForm(false)

    toast({
      title: "Announcement Created",
      description: "Your announcement has been sent to all employees.",
    })
  }

  const handleDeleteAnnouncement = (announcementId: string) => {
    const announcement = announcements.find((ann) => ann.id === announcementId)
    if (announcement) {
      setAnnouncements(announcements.filter((ann) => ann.id !== announcementId))
      toast({
        title: "Announcement Deleted",
        description: `"${announcement.title}" has been removed.`,
      })
    }
  }

  const getTypeColor = (type: Announcement["type"]) => {
    const colors = {
      info: "bg-blue-100 text-blue-800",
      warning: "bg-yellow-100 text-yellow-800",
      success: "bg-green-100 text-green-800",
      urgent: "bg-red-100 text-red-800",
    }
    return colors[type]
  }

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
                <p className="text-muted-foreground">Create and manage company-wide announcements</p>
              </div>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Announcement
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{announcements.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {announcements.filter((ann) => new Date(ann.date).getMonth() === new Date().getMonth()).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Urgent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {announcements.filter((ann) => ann.type === "urgent").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">Employees</p>
                </CardContent>
              </Card>
            </div>

            {/* Announcements List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
                <CardDescription>Manage your company announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.length === 0 ? (
                    <div className="text-center py-8">
                      <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No announcements yet</p>
                      <p className="text-sm text-muted-foreground">Create your first announcement to get started</p>
                    </div>
                  ) : (
                    announcements.map((announcement) => (
                      <div key={announcement.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{announcement.title}</h3>
                              <Badge className={getTypeColor(announcement.type)}>{announcement.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{announcement.message}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>By {announcement.author}</span>
                              <span>{new Date(announcement.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Create Announcement Modal */}
            {showCreateForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Create Announcement</CardTitle>
                    <CardDescription>Send a message to all employees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                          placeholder="Enter announcement title"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Type *</Label>
                        <select
                          id="type"
                          value={newAnnouncement.type}
                          onChange={(e) =>
                            setNewAnnouncement({ ...newAnnouncement, type: e.target.value as Announcement["type"] })
                          }
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="info">Information</option>
                          <option value="warning">Warning</option>
                          <option value="success">Success</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={newAnnouncement.message}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                          placeholder="Enter your announcement message"
                          rows={4}
                          required
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          <Send className="w-4 h-4 mr-2" />
                          Send Announcement
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => setShowCreateForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
