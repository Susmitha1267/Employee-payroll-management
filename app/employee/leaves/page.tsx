"use client"

import type React from "react"

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
import { getCurrentUser } from "@/lib/auth"
import {
  sampleLeaveRequests,
  sampleLeaveBalance,
  calculateLeaveDays,
  getLeaveTypeLabel,
  getStatusColor,
  canApplyLeave,
  type LeaveType,
} from "@/lib/leave"
import { Calendar, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EmployeeLeaves() {
  const user = getCurrentUser()
  const { toast } = useToast()

  const [leaveForm, setLeaveForm] = useState({
    leaveType: "" as LeaveType | "",
    startDate: "",
    endDate: "",
    reason: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter leave requests for current user
  const userLeaveRequests = sampleLeaveRequests.filter((request) => request.employeeId === user?.employeeId)

  const handleInputChange = (field: string, value: string) => {
    setLeaveForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const totalDays = calculateLeaveDays(leaveForm.startDate, leaveForm.endDate)

    // Validate leave balance
    if (leaveForm.leaveType) {
      const validation = canApplyLeave(leaveForm.leaveType, totalDays, sampleLeaveBalance)
      if (!validation.canApply) {
        toast({
          title: "Cannot Apply Leave",
          description: validation.message,
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Leave Application Submitted",
        description: `Your ${getLeaveTypeLabel(leaveForm.leaveType as LeaveType)} application for ${totalDays} days has been submitted for approval.`,
      })

      // Reset form
      setLeaveForm({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      })

      setIsSubmitting(false)
    }, 1500)
  }

  const totalDays =
    leaveForm.startDate && leaveForm.endDate ? calculateLeaveDays(leaveForm.startDate, leaveForm.endDate) : 0

  return (
    <AuthGuard allowedRoles={["employee"]} requireProfileComplete>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Leaves</h1>
                <p className="text-muted-foreground">Apply for leave and track your leave balance</p>
              </div>
            </div>

            {/* Leave Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(sampleLeaveBalance)
                .filter(([key]) => !["employeeId", "year"].includes(key))
                .map(([leaveType, balance]) => (
                  <Card key={leaveType}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium capitalize">{leaveType} Leave</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">{(balance as any).remaining}</div>
                      <p className="text-xs text-muted-foreground">
                        {(balance as any).used} used of {(balance as any).total}
                      </p>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${((balance as any).used / (balance as any).total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Main Content */}
            <Tabs defaultValue="apply" className="space-y-6">
              <TabsList>
                <TabsTrigger value="apply">Apply Leave</TabsTrigger>
                <TabsTrigger value="history">Leave History</TabsTrigger>
              </TabsList>

              <TabsContent value="apply" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Apply for Leave
                    </CardTitle>
                    <CardDescription>Submit a new leave application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="leaveType">Leave Type *</Label>
                          <Select
                            value={leaveForm.leaveType}
                            onValueChange={(value) => handleInputChange("leaveType", value)}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select leave type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sick">Sick Leave</SelectItem>
                              <SelectItem value="casual">Casual Leave</SelectItem>
                              <SelectItem value="paid">Paid Leave</SelectItem>
                              <SelectItem value="emergency">Emergency Leave</SelectItem>
                              <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Available Balance</Label>
                          <div className="p-2 bg-muted rounded text-sm">
                            {leaveForm.leaveType
                              ? `${(sampleLeaveBalance as any)[leaveForm.leaveType]?.remaining || 0} days remaining`
                              : "Select leave type to see balance"}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={leaveForm.startDate}
                            onChange={(e) => handleInputChange("startDate", e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="endDate">End Date *</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={leaveForm.endDate}
                            onChange={(e) => handleInputChange("endDate", e.target.value)}
                            min={leaveForm.startDate || new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>
                      </div>

                      {totalDays > 0 && (
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <p className="text-sm font-medium">
                            Total Leave Days: <span className="text-primary">{totalDays} days</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            From {new Date(leaveForm.startDate).toLocaleDateString()} to{" "}
                            {new Date(leaveForm.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Leave *</Label>
                        <Textarea
                          id="reason"
                          value={leaveForm.reason}
                          onChange={(e) => handleInputChange("reason", e.target.value)}
                          placeholder="Please provide a reason for your leave application"
                          rows={4}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || !leaveForm.leaveType || !leaveForm.startDate || !leaveForm.endDate}
                      >
                        {isSubmitting ? "Submitting Application..." : "Submit Leave Application"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Leave History
                    </CardTitle>
                    <CardDescription>Track your leave applications and their status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userLeaveRequests.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No leave applications found</p>
                          <p className="text-sm text-muted-foreground">
                            Apply for your first leave using the form above
                          </p>
                        </div>
                      ) : (
                        userLeaveRequests.map((request) => (
                          <div key={request.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{getLeaveTypeLabel(request.leaveType)}</h3>
                                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(request.startDate).toLocaleDateString()} -{" "}
                                  {new Date(request.endDate).toLocaleDateString()} ({request.totalDays} days)
                                </p>
                              </div>
                              <div className="text-right text-sm text-muted-foreground">
                                <p>Applied: {new Date(request.appliedDate).toLocaleDateString()}</p>
                                {request.approvedDate && (
                                  <p>
                                    {request.status === "approved" ? "Approved" : "Processed"}:{" "}
                                    {new Date(request.approvedDate).toLocaleDateString()}
                                  </p>
                                )}
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

                              {request.approvedBy && (
                                <div>
                                  <p className="text-sm font-medium">Approved By:</p>
                                  <p className="text-sm text-muted-foreground">{request.approvedBy}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                              {request.status === "approved" && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="text-sm">Approved</span>
                                </div>
                              )}
                              {request.status === "rejected" && (
                                <div className="flex items-center gap-1 text-red-600">
                                  <XCircle className="w-4 h-4" />
                                  <span className="text-sm">Rejected</span>
                                </div>
                              )}
                              {request.status === "pending" && (
                                <div className="flex items-center gap-1 text-yellow-600">
                                  <AlertCircle className="w-4 h-4" />
                                  <span className="text-sm">Pending Approval</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
