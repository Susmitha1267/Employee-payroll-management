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
import { useState } from "react"
import { getCurrentUser, updateUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { User, Edit, Save, X } from "lucide-react"

const countries = [
  { code: "US", name: "United States", currency: "$" },
  { code: "IN", name: "India", currency: "₹" },
  { code: "UK", name: "United Kingdom", currency: "£" },
  { code: "EU", name: "European Union", currency: "€" },
  { code: "JP", name: "Japan", currency: "¥" },
  { code: "CA", name: "Canada", currency: "C$" },
  { code: "AU", name: "Australia", currency: "A$" },
]

const departments = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
  "Customer Support",
  "Legal",
]

export default function EmployeeProfile() {
  const user = getCurrentUser()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    fullName: user?.name || "",
    employeeId: user?.employeeId || "",
    department: user?.department || "",
    jobRole: user?.jobRole || "",
    contactNumber: "+1 (555) 123-4567",
    email: user?.email || "",
    address: "123 Main Street, City, State 12345",
    country: user?.country || "US",
    joinDate: user?.joinDate || "2023-01-15",
    profilePhoto: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      updateUser({
        name: profileData.fullName,
        department: profileData.department,
        jobRole: profileData.jobRole,
        country: profileData.country,
        joinDate: profileData.joinDate,
      })

      toast({
        title: "Profile updated successfully!",
        description: "Your profile information has been saved.",
      })

      setIsEditing(false)
      setIsLoading(false)
    }, 1000)
  }

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      fullName: user?.name || "",
      employeeId: user?.employeeId || "",
      department: user?.department || "",
      jobRole: user?.jobRole || "",
      contactNumber: "+1 (555) 123-4567",
      email: user?.email || "",
      address: "123 Main Street, City, State 12345",
      country: user?.country || "US",
      joinDate: user?.joinDate || "2023-01-15",
      profilePhoto: "",
    })
    setIsEditing(false)
  }

  const selectedCountry = countries.find((c) => c.code === profileData.country)

  return (
    <AuthGuard allowedRoles={["employee"]} requireProfileComplete>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
                <p className="text-muted-foreground">View and update your personal information</p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                    {profileData.profilePhoto ? (
                      <img
                        src={profileData.profilePhoto || "/placeholder.svg"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{profileData.fullName}</CardTitle>
                    <CardDescription className="text-base">
                      {profileData.jobRole} • {profileData.department}
                    </CardDescription>
                    <Badge variant="secondary" className="mt-1">
                      ID: {profileData.employeeId}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="fullName"
                          value={profileData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">{profileData.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <p className="text-sm bg-muted p-2 rounded">{profileData.email}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      {isEditing ? (
                        <Input
                          id="contactNumber"
                          value={profileData.contactNumber}
                          onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">{profileData.contactNumber}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Joining Date</Label>
                      {isEditing ? (
                        <Input
                          id="joinDate"
                          type="date"
                          value={profileData.joinDate}
                          onChange={(e) => handleInputChange("joinDate", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">
                          {new Date(profileData.joinDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Work Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      {isEditing ? (
                        <Select
                          value={profileData.department}
                          onValueChange={(value) => handleInputChange("department", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">{profileData.department}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobRole">Job Role</Label>
                      {isEditing ? (
                        <Input
                          id="jobRole"
                          value={profileData.jobRole}
                          onChange={(e) => handleInputChange("jobRole", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">{profileData.jobRole}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <p className="text-sm bg-muted p-2 rounded">{profileData.employeeId}</p>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Location Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      {isEditing ? (
                        <Select
                          value={profileData.country}
                          onValueChange={(value) => handleInputChange("country", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.name} ({country.currency})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">
                          {selectedCountry?.name} ({selectedCountry?.currency})
                        </p>
                      )}
                      {isEditing && selectedCountry && (
                        <p className="text-sm text-muted-foreground">
                          Your salary will be displayed in {selectedCountry.currency}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <Textarea
                          id="address"
                          value={profileData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">{profileData.address}</p>
                      )}
                    </div>
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
