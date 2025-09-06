"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getCurrentUser } from "@/lib/auth"
import {
  sampleSalaryStructure,
  sampleSalaryHistory,
  calculateNetSalary,
  formatCurrency,
  currencyMap,
} from "@/lib/salary"
import { Download, Eye, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export default function EmployeeSalary() {
  const user = getCurrentUser()
  const currency = user?.country ? currencyMap[user.country] || "$" : "$"

  // Update salary structure with user's currency
  const salaryStructure = {
    ...sampleSalaryStructure,
    currency,
    netSalary: calculateNetSalary(sampleSalaryStructure),
  }

  const totalEarnings =
    salaryStructure.basicPay +
    salaryStructure.allowances.reduce((sum, item) => sum + item.amount, 0) +
    salaryStructure.bonuses.reduce((sum, item) => sum + item.amount, 0)

  const totalDeductions =
    salaryStructure.deductions.reduce((sum, item) => sum + item.amount, 0) +
    salaryStructure.taxes.reduce((sum, item) => sum + item.amount, 0) +
    salaryStructure.leaveDeductions

  return (
    <AuthGuard allowedRoles={["employee"]} requireProfileComplete>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Salary</h1>
                <p className="text-muted-foreground">
                  Salary breakdown for {salaryStructure.month} {salaryStructure.year}
                </p>
              </div>
              <Button asChild>
                <Link href="/employee/salary-slip">
                  <Download className="w-4 h-4 mr-2" />
                  Download Salary Slip
                </Link>
              </Button>
            </div>

            {/* Current Salary Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Gross Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings, currency)}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.5% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Deductions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions, currency)}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -1.2% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Net Salary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(salaryStructure.netSalary, currency)}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +3.8% from last month
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Earnings</CardTitle>
                  <CardDescription>Breakdown of your earnings components</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Basic Pay</span>
                    <span className="font-semibold">{formatCurrency(salaryStructure.basicPay, currency)}</span>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Allowances</h4>
                    {salaryStructure.allowances.map((allowance) => (
                      <div key={allowance.id} className="flex justify-between items-center text-sm">
                        <span>{allowance.name}</span>
                        <span>{formatCurrency(allowance.amount, currency)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Bonuses</h4>
                    {salaryStructure.bonuses.map((bonus) => (
                      <div key={bonus.id} className="flex justify-between items-center text-sm">
                        <span>{bonus.name}</span>
                        <span>{formatCurrency(bonus.amount, currency)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center font-semibold text-green-600">
                    <span>Total Earnings</span>
                    <span>{formatCurrency(totalEarnings, currency)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Deductions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Deductions</CardTitle>
                  <CardDescription>Breakdown of your deduction components</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Statutory Deductions</h4>
                    {salaryStructure.deductions.map((deduction) => (
                      <div key={deduction.id} className="flex justify-between items-center text-sm">
                        <span>{deduction.name}</span>
                        <span>{formatCurrency(deduction.amount, currency)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Taxes</h4>
                    {salaryStructure.taxes.map((tax) => (
                      <div key={tax.id} className="flex justify-between items-center text-sm">
                        <span>{tax.name}</span>
                        <span>{formatCurrency(tax.amount, currency)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {salaryStructure.leaveDeductions > 0 && (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span>Leave Deductions</span>
                        <span>{formatCurrency(salaryStructure.leaveDeductions, currency)}</span>
                      </div>
                      <Separator />
                    </>
                  )}

                  <div className="flex justify-between items-center font-semibold text-red-600">
                    <span>Total Deductions</span>
                    <span>{formatCurrency(totalDeductions, currency)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Net Salary Card */}
            <Card className="border-primary">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Net Salary</h3>
                    <p className="text-sm text-muted-foreground">
                      After all deductions for {salaryStructure.month} {salaryStructure.year}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {formatCurrency(salaryStructure.netSalary, currency)}
                    </div>
                    <Badge variant="secondary" className="mt-1">
                      {salaryStructure.workingDays - salaryStructure.leaveDays}/{salaryStructure.workingDays} days
                      worked
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Salary History */}
            <Card>
              <CardHeader>
                <CardTitle>Salary History</CardTitle>
                <CardDescription>Your salary records for the past months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleSalaryHistory.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">
                            {record.month} {record.year}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Net Salary: {formatCurrency(record.netSalary, record.currency)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={record.status === "paid" ? "default" : "secondary"}
                          className={record.status === "paid" ? "bg-green-100 text-green-800" : ""}
                        >
                          {record.status}
                        </Badge>
                        {record.slipUrl && (
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Slip
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
