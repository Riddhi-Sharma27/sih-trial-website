"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Shield,
  Camera,
  AlertTriangle,
  Activity,
  Users,
  Settings,
  LogOut,
  Eye,
  Lock,
  HardDrive,
  Clock,
  MapPin,
  Bell,
  ChevronDown,
} from "lucide-react"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Mock data for surveillance system
  const [systemStats] = useState({
    activeCameras: 24,
    totalCameras: 28,
    alerts: 3,
    storageUsed: 78,
    uptime: "99.8%",
    lastIncident: "2 hours ago",
  })

  const [cameraFeeds] = useState([
    { id: 1, name: "Main Entrance", status: "active", location: "Building A" },
    { id: 2, name: "Parking Lot", status: "active", location: "Exterior" },
    { id: 3, name: "Server Room", status: "maintenance", location: "Building B" },
    { id: 4, name: "Reception", status: "active", location: "Building A" },
    { id: 5, name: "Emergency Exit", status: "active", location: "Building C" },
    { id: 6, name: "Loading Dock", status: "offline", location: "Exterior" },
  ])

  const [recentAlerts] = useState([
    {
      id: 1,
      type: "motion",
      message: "Unauthorized access detected - Main Entrance",
      time: "10:45 AM",
      severity: "high",
    },
    { id: 2, type: "system", message: "Camera 3 offline - Server Room", time: "09:30 AM", severity: "medium" },
    { id: 3, type: "motion", message: "After hours movement - Parking Lot", time: "08:15 AM", severity: "low" },
  ])

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [user, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-card-foreground">SecureVision</h1>
                <p className="text-sm text-muted-foreground">Surveillance Control Center</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-card-foreground">{currentTime.toLocaleTimeString()}</p>
              <p className="text-xs text-muted-foreground">{currentTime.toLocaleDateString()}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <span className="hidden sm:inline text-card-foreground">{user.displayName || "User"}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Active Cameras</CardTitle>
              <Camera className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {systemStats.activeCameras}/{systemStats.totalCameras}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((systemStats.activeCameras / systemStats.totalCameras) * 100)}% operational
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Active Alerts</CardTitle>
              <AlertTriangle className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{systemStats.alerts}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">System Uptime</CardTitle>
              <Activity className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{systemStats.uptime}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Storage Used</CardTitle>
              <HardDrive className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{systemStats.storageUsed}%</div>
              <Progress value={systemStats.storageUsed} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Status */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Eye className="w-5 h-5" />
                Camera Status
              </CardTitle>
              <CardDescription>Real-time monitoring of all surveillance cameras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cameraFeeds.map((camera) => (
                  <div key={camera.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          camera.status === "active"
                            ? "bg-accent animate-pulse"
                            : camera.status === "maintenance"
                              ? "bg-yellow-500"
                              : "bg-destructive"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-card-foreground">{camera.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {camera.location}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        camera.status === "active"
                          ? "default"
                          : camera.status === "maintenance"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {camera.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Bell className="w-5 h-5" />
                Recent Alerts
              </CardTitle>
              <CardDescription>Latest security notifications and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.severity === "high"
                          ? "bg-destructive"
                          : alert.severity === "medium"
                            ? "bg-yellow-500"
                            : "bg-accent"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{alert.message}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </p>
                    </div>
                    <Badge
                      variant={
                        alert.severity === "high"
                          ? "destructive"
                          : alert.severity === "medium"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
              <CardDescription>Common surveillance system operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 bg-transparent">
                  <Lock className="w-6 h-6" />
                  <span>Lock All</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 bg-transparent">
                  <Camera className="w-6 h-6" />
                  <span>View Feeds</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 bg-transparent">
                  <AlertTriangle className="w-6 h-6" />
                  <span>Alert Center</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 bg-transparent">
                  <Settings className="w-6 h-6" />
                  <span>System Config</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
