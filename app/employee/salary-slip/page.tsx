"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { getCurrentUser } from "@/lib/auth"
import {
  sampleSalaryStructure,
  sampleSalaryHistory,
  calculateNetSalary,
  formatCurrency,
  currencyMap,
} from "@/lib/salary"
import { generateSalarySlipPDF, downloadBlob, type PDFSalarySlipData } from "@/lib/pdf-generator"
import { Download, FileText, Calendar, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SalarySlipPage() {
  const user = getCurrentUser()
  const { toast } = useToast()
  const [selectedMonth, setSelectedMonth] = useState("December 2024")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const currency = user?.country ? currencyMap[user.country] || "$" : "$"

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

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)

    try {
      const pdfData: PDFSalarySlipData = {
        employee: {
          name: user?.name || "Employee",
          id: user?.employeeId || "EMP001",
          department: user?.department || "Engineering",
          designation: user?.jobRole || "Software Engineer",
          email: user?.email || "employee@company.com",
        },
        payPeriod: {
          month: salaryStructure.month,
          year: salaryStructure.year,
          workingDays: salaryStructure.workingDays,
          paidDays: salaryStructure.workingDays - salaryStructure.leaveDays,
        },
        earnings: {
          basic: salaryStructure.basicPay,
          allowances: salaryStructure.allowances,
          bonuses: salaryStructure.bonuses,
          total: totalEarnings,
        },
        deductions: {
          statutory: salaryStructure.deductions,
          taxes: salaryStructure.taxes,
          leaves: salaryStructure.leaveDeductions,
          total: totalDeductions,
        },
        netSalary: salaryStructure.netSalary,
        currency: currency,
      }

      const pdfBlob = await generateSalarySlipPDF(pdfData)
      const filename = `salary-slip-${user?.employeeId}-${selectedMonth.replace(" ", "-")}.pdf`

      downloadBlob(pdfBlob, filename)

      toast({
        title: "PDF Generated Successfully",
        description: "Your salary slip has been downloaded.",
      })
    } catch (error) {
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating your salary slip. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <AuthGuard allowedRoles={["employee"]} requireProfileComplete>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Salary Slip</h1>
                <p className="text-muted-foreground">Download and view your salary slips</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <FileText className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
                  {isGeneratingPDF ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
                </Button>
              </div>
            </div>

            {/* Month Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Select Month
                </CardTitle>
                <CardDescription>Choose the month for which you want to view the salary slip</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleSalaryHistory.map((record) => (
                      <SelectItem key={record.id} value={`${record.month} ${record.year}`}>
                        {record.month} {record.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Salary Slip */}
            <Card className="print:shadow-none print:border-0">
              <CardHeader className="text-center border-b">
                <CardTitle className="text-2xl text-primary">PayrollPro</CardTitle>
                <CardDescription className="text-lg font-semibold">Salary Slip</CardDescription>
                <p className="text-sm text-muted-foreground">For the month of {selectedMonth}</p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Employee Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Employee Details</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{user?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Employee ID:</span>
                        <span className="font-medium">{user?.employeeId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="font-medium">{user?.department || "Engineering"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Designation:</span>
                        <span className="font-medium">{user?.jobRole || "Software Engineer"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Pay Period</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Month/Year:</span>
                        <span className="font-medium">{selectedMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Working Days:</span>
                        <span className="font-medium">{salaryStructure.workingDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Leave Days:</span>
                        <span className="font-medium">{salaryStructure.leaveDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid Days:</span>
                        <span className="font-medium">{salaryStructure.workingDays - salaryStructure.leaveDays}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Earnings and Deductions */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Earnings */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-green-600">Earnings</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Basic Pay</span>
                        <span className="font-medium">{formatCurrency(salaryStructure.basicPay, currency)}</span>
                      </div>

                      {salaryStructure.allowances.map((allowance) => (
                        <div key={allowance.id} className="flex justify-between">
                          <span>{allowance.name}</span>
                          <span className="font-medium">{formatCurrency(allowance.amount, currency)}</span>
                        </div>
                      ))}

                      {salaryStructure.bonuses.map((bonus) => (
                        <div key={bonus.id} className="flex justify-between">
                          <span>{bonus.name}</span>
                          <span className="font-medium">{formatCurrency(bonus.amount, currency)}</span>
                        </div>
                      ))}

                      <Separator />
                      <div className="flex justify-between font-semibold text-green-600">
                        <span>Total Earnings</span>
                        <span>{formatCurrency(totalEarnings, currency)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-red-600">Deductions</h3>
                    <div className="space-y-2 text-sm">
                      {salaryStructure.deductions.map((deduction) => (
                        <div key={deduction.id} className="flex justify-between">
                          <span>{deduction.name}</span>
                          <span className="font-medium">{formatCurrency(deduction.amount, currency)}</span>
                        </div>
                      ))}

                      {salaryStructure.taxes.map((tax) => (
                        <div key={tax.id} className="flex justify-between">
                          <span>{tax.name}</span>
                          <span className="font-medium">{formatCurrency(tax.amount, currency)}</span>
                        </div>
                      ))}

                      {salaryStructure.leaveDeductions > 0 && (
                        <div className="flex justify-between">
                          <span>Leave Deductions</span>
                          <span className="font-medium">
                            {formatCurrency(salaryStructure.leaveDeductions, currency)}
                          </span>
                        </div>
                      )}

                      <Separator />
                      <div className="flex justify-between font-semibold text-red-600">
                        <span>Total Deductions</span>
                        <span>{formatCurrency(totalDeductions, currency)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="border-2" />

                {/* Net Salary */}
                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Net Salary</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(salaryStructure.netSalary, currency)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Amount to be credited to your account</p>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-muted-foreground pt-4 border-t">
                  <p>This is a computer-generated salary slip and does not require a signature.</p>
                  <p className="mt-1">Generated on {new Date().toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
