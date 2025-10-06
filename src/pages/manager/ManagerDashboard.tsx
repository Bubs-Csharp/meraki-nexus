import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, DollarSign, AlertCircle } from "lucide-react";

const ManagerDashboard = () => {
  const { profile } = useAuth();

  const stats = [
    { title: "Total Clients", value: "0", icon: Users, description: "Active clients" },
    { title: "Properties Under Management", value: "0", icon: Building2, description: "All properties" },
    { title: "Monthly Revenue", value: "$0", icon: DollarSign, description: "This month" },
    { title: "Pending Tasks", value: "0", icon: AlertCircle, description: "Require attention" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Property Manager Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.first_name}! Here's your portfolio overview</p>
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
              <CardTitle>Today's Priorities</CardTitle>
              <CardDescription>Tasks requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">No urgent tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Communications</CardTitle>
              <CardDescription>Recent messages</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">No new messages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">Loading metrics...</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
