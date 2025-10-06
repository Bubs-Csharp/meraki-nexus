import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, CheckCircle, Clock, Camera } from "lucide-react";

const RunnerDashboard = () => {
  const { profile } = useAuth();

  const stats = [
    { title: "Today's Visits", value: "0", icon: MapPin, description: "Scheduled" },
    { title: "Completed Tasks", value: "0", icon: CheckCircle, description: "This week" },
    { title: "Pending Tasks", value: "0", icon: Clock, description: "Active" },
    { title: "Photos Uploaded", value: "0", icon: Camera, description: "This month" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Field Operations Dashboard</h1>
          <p className="text-muted-foreground">Hello, {profile?.first_name}! Your schedule for today</p>
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Route</CardTitle>
              <CardDescription>Optimized visit sequence</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">No visits scheduled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Maintenance Tasks</CardTitle>
              <CardDescription>Current assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">No active tasks</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RunnerDashboard;
