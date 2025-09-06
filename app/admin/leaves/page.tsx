"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import {
  sampleLeaveRequests,
  getLeaveTypeLabel,
  getStatusColor,
  type LeaveRequest,
  type LeaveStatus,
} from "@/lib/leave"
import { Calendar, Users, CheckCircle, XCircle, Clock, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminLeaves() {
  const { toast } = useToast()
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [adminRemarks, setAdminRemarks] = useState("")
  const [filterStatus, setFilterStatus] = useState<LeaveStatus | "all">("all")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")

  const handleApproveReject = async (requestId: string, action: "approve" | "reject") => {
    const request = sampleLeaveRequests.find((r) => r.id === requestId)
    if (!request) return

    // Simulate API call
    setTimeout(() => {
      toast({
        title: `Leave ${action === "approve" ? "Approved" : "Rejected"}`,
        description: `${request.employeeName}'s leave application has been ${action}d.`,
      })

      setSelectedRequest(null)
      setAdminRemarks("")
    }, 1000)
  }

  // Filter leave requests
  const filteredRequests = sampleLeaveRequests.filter((request) => {
    const statusMatch = filterStatus === "all" || request.status === filterStatus
    const departmentMatch = filterDepartment === "all" || request.department === filterDepartment
    return statusMatch && departmentMatch
  })

  const departments = [...new Set(sampleLeaveRequests.map((r) => r.department))]

  const stats = {
    total: sampleLeaveRequests.length,
    pending: sampleLeaveRequests.filter((r) => r.status === "pending").length,
    approved: sampleLeaveRequests.filter((r) => r.status === "approved").length,
    rejected: sampleLeaveRequests.filter((r) => r.status === "rejected").length,
  }

  return (
    <AuthGuard allowedRoles={["admin"]}>
      {" "}
      {/* Removed "manager" and "hr" from allowed roles */}
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Leave Management</h1>
                <p className="text-muted-foreground">Review and manage employee leave requests</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="requests" className="space-y-6">
              <TabsList>
                <TabsTrigger value="requests">Leave Requests</TabsTrigger>
                <TabsTrigger value="calendar">Leave Calendar</TabsTrigger>
                <TabsTrigger value="policies">Leave Policies</TabsTrigger>
              </TabsList>

              <TabsContent value="requests" className="space-y-6">
                {/* Filters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                          <SelectTrigger>
                            <SelectValue placeholder="All departments" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="search">Search Employee</Label>
                        <Input id="search" placeholder="Search by name or ID" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Leave Requests */}
                <Card>
                  <CardHeader>
                    <CardTitle>Leave Requests</CardTitle>
                    <CardDescription>Review and approve employee leave applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredRequests.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No leave requests found</p>
                          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
                        </div>
                      ) : (
                        filteredRequests.map((request) => (
                          <div key={request.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{request.employeeName}</h3>
                                  <Badge variant="secondary">{request.employeeId}</Badge>
                                  <Badge variant="outline">{request.department}</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{getLeaveTypeLabel(request.leaveType)}</span>
                                  <span>
                                    {new Date(request.startDate).toLocaleDateString()} -{" "}
                                    {new Date(request.endDate).toLocaleDateString()}
                                  </span>
                                  <span>{request.totalDays} days</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(request.appliedDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium">Reason:</p>
                                <p className="text-sm text-muted-foreground">{request.reason}</p>
                              </div>

                              {request.adminRemarks && (
                                <div>
                                  <p className="text-sm font-medium">Admin Remarks:</p>
                                  <p className="text-sm text-muted-foreground">{request.adminRemarks}</p>
                                </div>
                              )}
                            </div>

                            {request.status === "pending" && (
                              <div className="flex items-center gap-2 pt-2 border-t">
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedRequest(request)}
                                  variant="outline"
                                  className="bg-transparent"
                                >
                                  Review
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveReject(request.id, "approve")}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleApproveReject(request.id, "reject")}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Leave Calendar</CardTitle>
                    <CardDescription>Visual overview of employee leaves</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Leave calendar view coming soon</p>
                      <p className="text-sm text-muted-foreground">
                        This will show a calendar view of all approved leaves
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="policies" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Leave Policies</CardTitle>
                    <CardDescription>Configure leave types and policies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Leave policy management coming soon</p>
                      <p className="text-sm text-muted-foreground">
                        Configure leave types, balances, and approval workflows
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Review Modal */}
            {selectedRequest && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Review Leave Request</CardTitle>
                    <CardDescription>
                      {selectedRequest.employeeName} - {getLeaveTypeLabel(selectedRequest.leaveType)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="remarks">Admin Remarks</Label>
                      <Textarea
                        id="remarks"
                        value={adminRemarks}
                        onChange={(e) => setAdminRemarks(e.target.value)}
                        placeholder="Add your remarks (optional)"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveReject(selectedRequest.id, "approve")}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        className="flex-1"
                        variant="destructive"
                        onClick={() => handleApproveReject(selectedRequest.id, "reject")}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => {
                        setSelectedRequest(null)
                        setAdminRemarks("")
                      }}
                    >
                      Cancel
                    </Button>
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
