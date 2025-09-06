"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, DollarSign, Calendar, TrendingUp, Building, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  dashboardStats,
  payrollTrends,
  leaveTrends,
  departmentStats,
  formatCurrency,
  formatPercentage,
} from "@/lib/analytics"
import Link from "next/link"

const COLORS = ["#8b5cf6", "#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

export default function AdminDashboard() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">Overview of your organization's payroll and HR metrics</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/admin/reports">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Reports
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/admin/employees">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Employees
                  </Link>
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalEmployees}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    {dashboardStats.activeEmployees} active
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardStats.monthlyPayroll)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    {formatPercentage(dashboardStats.payrollGrowth)} from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{dashboardStats.pendingLeaves}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    Awaiting approval
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(dashboardStats.avgSalary)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    Per employee
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payroll Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Payroll Trends</CardTitle>
                  <CardDescription>Monthly payroll expenses over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={payrollTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), "Payroll"]} />
                      <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Leave Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Leave Distribution</CardTitle>
                  <CardDescription>Breakdown of leave types this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={leaveTrends}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {leaveTrends.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Department Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>Employee count and payroll by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis yAxisId="left" tickFormatter={(value) => `$${value / 1000}k`} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "totalPayroll" ? formatCurrency(value as number) : value,
                        name === "totalPayroll" ? "Total Payroll" : "Employees",
                      ]}
                    />
                    <Bar yAxisId="left" dataKey="totalPayroll" fill="#8b5cf6" />
                    <Bar yAxisId="right" dataKey="employees" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Frequently used administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start">
                    <Link href="/admin/employees">
                      <Users className="mr-2 h-4 w-4" />
                      Add New Employee
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/admin/payroll">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Generate Payroll
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/admin/leaves">
                      <Calendar className="mr-2 h-4 w-4" />
                      Review Leave Requests
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/admin/announcements">
                      <Building className="mr-2 h-4 w-4" />
                      Send Announcement
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Payroll processed for December</p>
                      <p className="text-xs text-muted-foreground">156 employees • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-blue-500 mt-1" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New employee onboarded</p>
                      <p className="text-xs text-muted-foreground">Sarah Johnson • Engineering • 5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-yellow-500 mt-1" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">8 leave requests pending approval</p>
                      <p className="text-xs text-muted-foreground">Various departments • 1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-1" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">System maintenance scheduled</p>
                      <p className="text-xs text-muted-foreground">Dec 31, 2024 • 2:00 AM - 4:00 AM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leave Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Summary</CardTitle>
                <CardDescription>Current month leave statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending Requests</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {dashboardStats.pendingLeaves}
                      </Badge>
                    </div>
                    <Progress value={(dashboardStats.pendingLeaves / 33) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Approved Requests</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {dashboardStats.approvedLeaves}
                      </Badge>
                    </div>
                    <Progress value={(dashboardStats.approvedLeaves / 33) * 100} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rejected Requests</span>
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        {dashboardStats.rejectedLeaves}
                      </Badge>
                    </div>
                    <Progress value={(dashboardStats.rejectedLeaves / 33) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
