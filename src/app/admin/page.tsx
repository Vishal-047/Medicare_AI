"use client"

import { useState, FC, ReactNode, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  FileText,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { format } from "date-fns"

// This interface now correctly reflects the data structure from our API
interface Application {
  _id: string
  fullName: string
  primarySpecialty: string
  createdAt: string
  status: "pending" | "approved" | "rejected"
  professionalEmail: string
  yearsOfExperience: string
  clinicAddress: string
  consultationTimings: string
  consultationFees: string
  professionalBio: string
  servicesOffered: string[]
  languagesSpoken: string[]
  medicalCouncilRegistrationNumber: string
  privateContactNumber: string
  panNumber: string
  bankAccountNumber: string
  ifscCode: string
  mbbsCertificate: string
  pgDegree: string
  superSpecialtyDegree?: string
  governmentId: string
  professionalHeadshot: string
}

const StatusBadge: FC<{ status: Application["status"] }> = ({ status }) => {
  const statusConfig = {
    pending: {
      icon: <Clock className="h-3.5 w-3.5" />,
      label: "Pending",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
    },
    approved: {
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      label: "Approved",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    },
    rejected: {
      icon: <XCircle className="h-3.5 w-3.5" />,
      label: "Rejected",
      className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    },
  }
  const config = statusConfig[status]
  return (
    <Badge
      variant="secondary"
      className={`gap-1.5 pl-2 pr-2.5 ${config.className}`}
    >
      {config.icon}
      <span className="font-medium">{config.label}</span>
    </Badge>
  )
}

const DetailItem: FC<{
  label: string
  value?: string | string[]
  children?: ReactNode
}> = ({ label, value, children }) => (
  <div>
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
      {label}
    </p>
    {value && (
      <p className="text-base text-slate-800 dark:text-slate-100">
        {Array.isArray(value) ? value.join(", ") : value}
      </p>
    )}
    {children}
  </div>
)

export default function AdminDashboard() {
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/doctor-applications")
      if (!response.ok) throw new Error("Failed to fetch applications")
      const { data } = await response.json()
      setApplications(data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error fetching applications",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAction = async (
    id: string,
    newStatus: "approved" | "rejected"
  ) => {
    setIsUpdating(id)
    try {
      const response = await fetch(`/api/doctor-applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message)

      toast({
        title: `Application ${newStatus}`,
        description: `Doctor ${applications.find((app) => app._id === id)?.fullName
          } has been ${newStatus}.`,
      })
      fetchApplications()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: `Failed to ${newStatus} application`,
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
      setSelectedApp(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Review and manage new doctor applications.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>
            The following doctors have applied to join the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">
                Loading applications...
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      No pending applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={app.professionalHeadshot} />
                            <AvatarFallback>
                              {app.fullName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-slate-900 dark:text-slate-50">
                            {app.fullName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300">
                        {app.primarySpecialty}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300">
                        {format(new Date(app.createdAt), "PPP")}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApp(app)}
                        >
                          View Details
                        </Button>
                        {app.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isUpdating === app._id}
                              className="text-red-600 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/50 dark:hover:text-red-400"
                              onClick={() => handleAction(app._id, "rejected")}
                            >
                              {isUpdating === app._id && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              disabled={isUpdating === app._id}
                              onClick={() => handleAction(app._id, "approved")}
                            >
                              {isUpdating === app._id && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Approve
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedApp && (
        <Dialog
          open={!!selectedApp}
          onOpenChange={(isOpen) => !isOpen && setSelectedApp(null)}
        >
          <DialogContent className="w-full !max-w-[95vw]">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Application Details
              </DialogTitle>
              <DialogDescription>
                Reviewing application for {selectedApp.fullName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 max-h-[70vh] overflow-y-auto pr-4">
              <div className="md:col-span-1 space-y-6">
                <DetailItem label="Full Name" value={selectedApp.fullName} />
                <DetailItem
                  label="Primary Specialty"
                  value={selectedApp.primarySpecialty}
                />
                <DetailItem
                  label="Years of Experience"
                  value={selectedApp.yearsOfExperience}
                />
                <DetailItem
                  label="Consultation Fees"
                  value={`₹${selectedApp.consultationFees}`}
                />
                <DetailItem
                  label="Languages Spoken"
                  value={selectedApp.languagesSpoken}
                />
                <DetailItem
                  label="Services Offered"
                  value={selectedApp.servicesOffered}
                />
              </div>
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Contact & Administrative
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <DetailItem
                      label="Professional Email"
                      value={selectedApp.professionalEmail}
                    />
                    <DetailItem
                      label="Private Contact"
                      value={selectedApp.privateContactNumber}
                    />
                    <DetailItem
                      label="Medical Council Reg. No"
                      value={selectedApp.medicalCouncilRegistrationNumber}
                    />
                    <DetailItem
                      label="PAN Number"
                      value={selectedApp.panNumber}
                    />
                    <DetailItem
                      label="Bank Account Number"
                      value={selectedApp.bankAccountNumber}
                    />
                    <DetailItem
                      label="IFSC Code"
                      value={selectedApp.ifscCode}
                    />
                  </CardContent>
                </Card>
                <DetailItem
                  label="Professional Bio"
                  value={selectedApp.professionalBio}
                />
                <DetailItem label="Clinic Address & Timings">
                  <p className="text-base text-slate-800 dark:text-slate-100">
                    {selectedApp.clinicAddress}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedApp.consultationTimings}
                  </p>
                </DetailItem>

                <DetailItem label="Submitted Documents">
                  <div className="mt-2 space-y-2">
                    <Link
                      href={selectedApp.mbbsCertificate || "#"}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <FileText className="h-4 w-4" />
                      <span>MBBS Certificate</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link
                      href={selectedApp.pgDegree || "#"}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <FileText className="h-4 w-4" /> <span>PG Degree</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    {selectedApp.superSpecialtyDegree && (
                      <Link
                        href={selectedApp.superSpecialtyDegree}
                        target="_blank"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Super Specialty Degree</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                    <Link
                      href={selectedApp.governmentId || "#"}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Government ID</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                    <Link
                      href={selectedApp.professionalHeadshot || "#"}
                      target="_blank"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Professional Headshot</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </DetailItem>
              </div>
            </div>
            <DialogFooter>
              {selectedApp.status === "pending" && (
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    disabled={isUpdating === selectedApp._id}
                    className="text-red-600 hover:bg-red-100 hover:text-red-700"
                    onClick={() => {
                      handleAction(selectedApp._id, "rejected")
                    }}
                  >
                    {isUpdating === selectedApp._id && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Reject Application
                  </Button>
                  <Button
                    disabled={isUpdating === selectedApp._id}
                    onClick={() => {
                      handleAction(selectedApp._id, "approved")
                    }}
                  >
                    {isUpdating === selectedApp._id && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Approve Application
                  </Button>
                </div>
              )}
              <Button variant="outline" onClick={() => setSelectedApp(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
