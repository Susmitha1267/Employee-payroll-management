export interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  monthlyPayroll: number
  pendingLeaves: number
  approvedLeaves: number
  rejectedLeaves: number
  avgSalary: number
  payrollGrowth: number
  leaveUtilization: number
}

export interface PayrollTrend {
  month: string
  amount: number
  employees: number
}

export interface LeaveTrend {
  type: string
  count: number
  percentage: number
}

export interface DepartmentStats {
  department: string
  employees: number
  avgSalary: number
  totalPayroll: number
}

// Sample analytics data
export const dashboardStats: DashboardStats = {
  totalEmployees: 156,
  activeEmployees: 152,
  monthlyPayroll: 842000,
  pendingLeaves: 8,
  approvedLeaves: 23,
  rejectedLeaves: 2,
  avgSalary: 5540,
  payrollGrowth: 12.5,
  leaveUtilization: 68.2,
}

export const payrollTrends: PayrollTrend[] = [
  { month: "Jul", amount: 780000, employees: 145 },
  { month: "Aug", amount: 795000, employees: 148 },
  { month: "Sep", amount: 810000, employees: 150 },
  { month: "Oct", amount: 825000, employees: 153 },
  { month: "Nov", amount: 835000, employees: 155 },
  { month: "Dec", amount: 842000, employees: 156 },
]

export const leaveTrends: LeaveTrend[] = [
  { type: "Paid Leave", count: 45, percentage: 42 },
  { type: "Sick Leave", count: 28, percentage: 26 },
  { type: "Casual Leave", count: 22, percentage: 21 },
  { type: "Emergency", count: 8, percentage: 7 },
  { type: "Others", count: 4, percentage: 4 },
]

export const departmentStats: DepartmentStats[] = [
  { department: "Engineering", employees: 45, avgSalary: 6200, totalPayroll: 279000 },
  { department: "Sales", employees: 32, avgSalary: 5800, totalPayroll: 185600 },
  { department: "Marketing", employees: 28, avgSalary: 5400, totalPayroll: 151200 },
  { department: "Finance", employees: 22, avgSalary: 5900, totalPayroll: 129800 },
  { department: "Administration", employees: 18, avgSalary: 5200, totalPayroll: 93600 }, // Changed "HR" to "Administration"
  { department: "Operations", employees: 11, avgSalary: 4800, totalPayroll: 52800 },
]

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
}
