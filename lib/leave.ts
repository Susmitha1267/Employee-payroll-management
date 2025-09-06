export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  department: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  status: LeaveStatus
  appliedDate: string
  approvedBy?: string
  approvedDate?: string
  adminRemarks?: string
}

export type LeaveType = "sick" | "casual" | "paid" | "maternity" | "paternity" | "emergency" | "unpaid"

export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled"

export interface LeaveBalance {
  employeeId: string
  year: number
  sick: { total: number; used: number; remaining: number }
  casual: { total: number; used: number; remaining: number }
  paid: { total: number; used: number; remaining: number }
  maternity: { total: number; used: number; remaining: number }
  paternity: { total: number; used: number; remaining: number }
}

export interface LeavePolicy {
  leaveType: LeaveType
  totalDays: number
  carryForward: boolean
  maxCarryForward?: number
  description: string
}

// Default leave policies
export const defaultLeavePolicies: LeavePolicy[] = [
  {
    leaveType: "sick",
    totalDays: 12,
    carryForward: false,
    description: "Medical leave for illness or health issues",
  },
  {
    leaveType: "casual",
    totalDays: 12,
    carryForward: true,
    maxCarryForward: 5,
    description: "Personal leave for personal matters",
  },
  {
    leaveType: "paid",
    totalDays: 21,
    carryForward: true,
    maxCarryForward: 10,
    description: "Annual vacation leave",
  },
  {
    leaveType: "maternity",
    totalDays: 180,
    carryForward: false,
    description: "Maternity leave for new mothers",
  },
  {
    leaveType: "paternity",
    totalDays: 15,
    carryForward: false,
    description: "Paternity leave for new fathers",
  },
]

// Sample leave requests
export const sampleLeaveRequests: LeaveRequest[] = [
  {
    id: "LR001",
    employeeId: "EMP001",
    employeeName: "John Doe",
    department: "Engineering",
    leaveType: "paid",
    startDate: "2024-12-25",
    endDate: "2024-12-26",
    totalDays: 2,
    reason: "Christmas holidays with family",
    status: "approved",
    appliedDate: "2024-12-15",
    approvedBy: "Admin", // Changed "Manager" to "Admin"
    approvedDate: "2024-12-16",
    adminRemarks: "Approved for holiday season",
  },
  {
    id: "LR002",
    employeeId: "EMP001",
    employeeName: "John Doe",
    department: "Engineering",
    leaveType: "sick",
    startDate: "2024-12-20",
    endDate: "2024-12-21",
    totalDays: 2,
    reason: "Fever and flu symptoms",
    status: "pending",
    appliedDate: "2024-12-19",
  },
  {
    id: "LR003",
    employeeId: "EMP002",
    employeeName: "Jane Smith",
    department: "Marketing",
    leaveType: "casual",
    startDate: "2024-12-30",
    endDate: "2024-12-31",
    totalDays: 2,
    reason: "Personal work",
    status: "approved",
    appliedDate: "2024-12-10",
    approvedBy: "Admin", // Changed "HR Manager" to "Admin"
    approvedDate: "2024-12-11",
  },
]

// Sample leave balance
export const sampleLeaveBalance: LeaveBalance = {
  employeeId: "EMP001",
  year: 2024,
  sick: { total: 12, used: 2, remaining: 10 },
  casual: { total: 12, used: 3, remaining: 9 },
  paid: { total: 21, used: 9, remaining: 12 },
  maternity: { total: 180, used: 0, remaining: 180 },
  paternity: { total: 15, used: 0, remaining: 15 },
}

export function calculateLeaveDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const timeDiff = end.getTime() - start.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
}

export function getLeaveTypeLabel(type: LeaveType): string {
  const labels: Record<LeaveType, string> = {
    sick: "Sick Leave",
    casual: "Casual Leave",
    paid: "Paid Leave",
    maternity: "Maternity Leave",
    paternity: "Paternity Leave",
    emergency: "Emergency Leave",
    unpaid: "Unpaid Leave",
  }
  return labels[type]
}

export function getStatusColor(status: LeaveStatus): string {
  const colors: Record<LeaveStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  }
  return colors[status]
}

export function canApplyLeave(
  leaveType: LeaveType,
  requestedDays: number,
  balance: LeaveBalance,
): { canApply: boolean; message?: string } {
  const typeBalance = balance[leaveType]

  if (!typeBalance) {
    return { canApply: false, message: "Invalid leave type" }
  }

  if (requestedDays > typeBalance.remaining) {
    return {
      canApply: false,
      message: `Insufficient balance. You have ${typeBalance.remaining} days remaining.`,
    }
  }

  return { canApply: true }
}
