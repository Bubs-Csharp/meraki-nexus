import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Activity, Settings } from "lucide-react";

const AdminDashboard = () => {
  const { profile } = useAuth();

  const stats = [
    { title: "Total Users", value: "0", icon: Users, description: "All roles" },
    { title: "Active Properties", value: "0", icon: Building2, description: "System-wide" },
    { title: "System Health", value: "Good", icon: Activity, description: "All systems operational" },
    { title: "Pending Actions", value: "0", icon: Settings, description: "Admin tasks" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {profile?.first_name}! System overview and administration</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Recent user activities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">No recent activities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Management</CardTitle>
              <CardDescription>Property management companies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">No companies registered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>Platform usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Loading analytics...</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
