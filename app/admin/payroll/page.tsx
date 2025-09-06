"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { formatCurrency } from "@/lib/salary"
import { Plus, Download, Send, Users, DollarSign, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const sampleEmployees = [
  { id: "EMP001", name: "John Doe", department: "Engineering", basicPay: 4000, status: "active" },
  { id: "EMP002", name: "Jane Smith", department: "Marketing", basicPay: 3500, status: "active" },
  { id: "EMP003", name: "Mike Johnson", department: "Finance", basicPay: 4200, status: "active" },
  { id: "EMP004", name: "Sarah Wilson", department: "Administration", basicPay: 3800, status: "active" }, // Changed "HR" to "Administration"
]

export default function AdminPayroll() {
  const { toast } = useToast()
  const [selectedMonth, setSelectedMonth] = useState("December 2024")
  const [bulkProcessing, setBulkProcessing] = useState(false)

  const handleBulkPayroll = async () => {
    setBulkProcessing(true)

    // Simulate bulk payroll processing
    setTimeout(() => {
      toast({
        title: "Bulk Payroll Generated",
        description: `Payroll for ${sampleEmployees.length} employees has been processed for ${selectedMonth}`,
      })
      setBulkProcessing(false)
    }, 3000)
  }

  const handleGenerateSlip = (employeeId: string, employeeName: string) => {
    toast({
      title: "Salary Slip Generated",
      description: `Salary slip for ${employeeName} has been generated successfully`,
    })
  }

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
                <p className="text-muted-foreground">Manage employee salaries and generate payroll</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button onClick={handleBulkPayroll} disabled={bulkProcessing}>
                  <Send className="w-4 h-4 mr-2" />
                  {bulkProcessing ? "Processing..." : "Generate Bulk Payroll"}
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sampleEmployees.length}</div>
                  <p className="text-xs text-muted-foreground">Active employees</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$21,600</div>
                  <p className="text-xs text-muted-foreground">Total for {selectedMonth}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Processed</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4/4</div>
                  <p className="text-xs text-muted-foreground">Salary slips generated</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$5,400</div>
                  <p className="text-xs text-muted-foreground">Per employee</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="employees" className="space-y-6">
              <TabsList>
                <TabsTrigger value="employees">Employee Payroll</TabsTrigger>
                <TabsTrigger value="structure">Salary Structure</TabsTrigger>
                <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
              </TabsList>

              <TabsContent value="employees" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Employee Payroll</CardTitle>
                    <CardDescription>Manage individual employee salary and generate slips</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sampleEmployees.map((employee) => (
                        <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {employee.id} • {employee.department}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(employee.basicPay, "$")}</p>
                              <p className="text-sm text-muted-foreground">Basic Pay</p>
                            </div>
                            <Badge variant="secondary">{employee.status}</Badge>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateSlip(employee.id, employee.name)}
                              >
                                Generate Slip
                              </Button>
                              <Button variant="outline" size="sm">
                                Edit Salary
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="structure" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Salary Structure Template</CardTitle>
                    <CardDescription>Define default salary components for new employees</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-green-600">Earnings Components</h3>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input placeholder="Component name" />
                            <Input placeholder="Amount" type="number" />
                            <Button variant="outline" size="sm">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between p-2 bg-muted rounded">
                              <span>HRA (House Rent Allowance)</span>
                              <span>20% of Basic</span>
                            </div>
                            <div className="flex justify-between p-2 bg-muted rounded">
                              <span>Travel Allowance</span>
                              <span>$300</span>
                            </div>
                            <div className="flex justify-between p-2 bg-muted rounded">
                              <span>Medical Allowance</span>
                              <span>$200</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-red-600">Deduction Components</h3>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input placeholder="Component name" />
                            <Input placeholder="Amount" type="number" />
                            <Button variant="outline" size="sm">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between p-2 bg-muted rounded">
                              <span>PF (Provident Fund)</span>
                              <span>12% of Basic</span>
                            </div>
                            <div className="flex justify-between p-2 bg-muted rounded">
                              <span>Insurance</span>
                              <span>$150</span>
                            </div>
                            <div className="flex justify-between p-2 bg-muted rounded">
                              <span>Income Tax</span>
                              <span>As per slab</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">Save Salary Structure Template</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bulk" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bulk Payroll Operations</CardTitle>
                    <CardDescription>Process payroll for all employees at once</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="month">Select Month</Label>
                          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="December 2024">December 2024</SelectItem>
                              <SelectItem value="November 2024">November 2024</SelectItem>
                              <SelectItem value="October 2024">October 2024</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="workingDays">Working Days</Label>
                          <Input id="workingDays" type="number" defaultValue="22" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold">Bulk Operations</h3>
                        <div className="space-y-2">
                          <Button className="w-full" onClick={handleBulkPayroll} disabled={bulkProcessing}>
                            <Send className="w-4 h-4 mr-2" />
                            {bulkProcessing ? "Processing Payroll..." : "Generate All Salary Slips"}
                          </Button>
                          <Button variant="outline" className="w-full bg-transparent">
                            <Download className="w-4 h-4 mr-2" />
                            Download All Slips (ZIP)
                          </Button>
                          <Button variant="outline" className="w-full bg-transparent">
                            <Send className="w-4 h-4 mr-2" />
                            Send Email Notifications
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Processing Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Employees</p>
                          <p className="font-semibold">{sampleEmployees.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Payroll</p>
                          <p className="font-semibold">$21,600</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Processing Status</p>
                          <p className="font-semibold text-green-600">Ready</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Processed</p>
                          <p className="font-semibold">Nov 30, 2024</p>
                        </div>
                      </div>
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
