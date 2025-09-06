export interface SalaryComponent {
  id: string
  name: string
  amount: number
  type: "earning" | "deduction"
  category: "basic" | "allowance" | "bonus" | "deduction" | "tax"
}

export interface SalaryStructure {
  employeeId: string
  basicPay: number
  allowances: SalaryComponent[]
  bonuses: SalaryComponent[]
  deductions: SalaryComponent[]
  taxes: SalaryComponent[]
  leaveDeductions: number
  netSalary: number
  currency: string
  month: string
  year: number
  workingDays: number
  leaveDays: number
}

export interface SalaryHistory {
  id: string
  month: string
  year: number
  netSalary: number
  currency: string
  slipUrl?: string
  status: "pending" | "processed" | "paid"
}

// Currency mapping based on country
export const currencyMap: Record<string, string> = {
  US: "$",
  IN: "₹",
  UK: "£",
  EU: "€",
  JP: "¥",
  CA: "C$",
  AU: "A$",
}

// Sample salary data for demo
export const sampleSalaryStructure: SalaryStructure = {
  employeeId: "EMP001",
  basicPay: 4000,
  allowances: [
    { id: "1", name: "HRA", amount: 800, type: "earning", category: "allowance" },
    { id: "2", name: "Travel Allowance", amount: 300, type: "earning", category: "allowance" },
    { id: "3", name: "Medical Allowance", amount: 200, type: "earning", category: "allowance" },
  ],
  bonuses: [{ id: "4", name: "Performance Bonus", amount: 500, type: "earning", category: "bonus" }],
  deductions: [
    { id: "5", name: "PF", amount: 480, type: "deduction", category: "deduction" },
    { id: "6", name: "Insurance", amount: 150, type: "deduction", category: "deduction" },
  ],
  taxes: [{ id: "7", name: "Income Tax", amount: 670, type: "deduction", category: "tax" }],
  leaveDeductions: 0,
  netSalary: 0,
  currency: "$",
  month: "December",
  year: 2024,
  workingDays: 22,
  leaveDays: 0,
}

export function calculateNetSalary(structure: SalaryStructure): number {
  const totalAllowances = structure.allowances.reduce((sum, item) => sum + item.amount, 0)
  const totalBonuses = structure.bonuses.reduce((sum, item) => sum + item.amount, 0)
  const totalDeductions = structure.deductions.reduce((sum, item) => sum + item.amount, 0)
  const totalTaxes = structure.taxes.reduce((sum, item) => sum + item.amount, 0)

  return (
    structure.basicPay + totalAllowances + totalBonuses - (totalDeductions + totalTaxes + structure.leaveDeductions)
  )
}

export function calculateLeaveDeduction(basicPay: number, workingDays: number, leaveDays: number): number {
  if (leaveDays <= 0) return 0
  return (basicPay / workingDays) * leaveDays
}

export function formatCurrency(amount: number, currency: string): string {
  return `${currency}${amount.toLocaleString()}`
}

export const sampleSalaryHistory: SalaryHistory[] = [
  {
    id: "1",
    month: "December",
    year: 2024,
    netSalary: 5400,
    currency: "$",
    status: "paid",
    slipUrl: "/salary-slips/dec-2024.pdf",
  },
  {
    id: "2",
    month: "November",
    year: 2024,
    netSalary: 5200,
    currency: "$",
    status: "paid",
    slipUrl: "/salary-slips/nov-2024.pdf",
  },
  {
    id: "3",
    month: "October",
    year: 2024,
    netSalary: 5400,
    currency: "$",
    status: "paid",
    slipUrl: "/salary-slips/oct-2024.pdf",
  },
  {
    id: "4",
    month: "September",
    year: 2024,
    netSalary: 5100,
    currency: "$",
    status: "paid",
    slipUrl: "/salary-slips/sep-2024.pdf",
  },
]
