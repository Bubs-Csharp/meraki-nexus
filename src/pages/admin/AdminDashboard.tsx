import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Activity, Settings, Shield, TrendingUp, Database, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminDashboard = () => {
  const { profile } = useAuth();

  // Fetch all users
  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, user_roles(role)');
      if (error) throw error;
      return data;
    },
  });

  // Fetch all companies
  const { data: companies } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  // Fetch all properties
  const { data: properties } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  // Fetch activity logs
  const { data: activityLogs } = useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*, profiles(first_name, last_name)')
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  // Fetch maintenance requests for system health
  const { data: maintenance } = useQuery({
    queryKey: ['admin-maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const totalUsers = users?.length || 0;
  const totalProperties = properties?.length || 0;
  const totalCompanies = companies?.length || 0;
  const activeUsers = users?.filter(u => u.user_roles?.length > 0).length || 0;
  const pendingMaintenance = maintenance?.filter(m => m.status === 'pending').length || 0;

  const stats = [
    { 
      title: "Total Users", 
      value: totalUsers.toString(), 
      icon: Users, 
      description: `${activeUsers} active users`,
      trend: "+12% from last month",
      color: "text-blue-500"
    },
    { 
      title: "Active Properties", 
      value: totalProperties.toString(), 
      icon: Building2, 
      description: "System-wide",
      trend: `${properties?.filter(p => p.status === 'occupied').length || 0} occupied`,
      color: "text-green-500"
    },
    { 
      title: "Companies", 
      value: totalCompanies.toString(), 
      icon: Shield, 
      description: "Registered companies",
      trend: "+2 this month",
      color: "text-purple-500"
    },
    { 
      title: "System Alerts", 
      value: pendingMaintenance.toString(), 
      icon: AlertTriangle, 
      description: "Pending items",
      trend: "3 require attention",
      color: "text-orange-500"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {profile?.first_name}! System overview and administration</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <p className="text-xs text-primary mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage system users and roles</CardDescription>
              </CardHeader>
              <CardContent>
                {users && users.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {users.slice(0, 9).map((user) => (
                        <div key={user.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{user.first_name} {user.last_name}</p>
                              <p className="text-xs text-muted-foreground">{user.role}</p>
                            </div>
                            <Badge variant="secondary">
                              {user.role || 'No role'}
                            </Badge>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                            <Button size="sm" variant="outline" className="text-xs">Manage Roles</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full">View All Users</Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No users found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Company Management
                </CardTitle>
                <CardDescription>Property management companies</CardDescription>
              </CardHeader>
              <CardContent>
                {companies && companies.length > 0 ? (
                  <div className="space-y-4">
                    {companies.map((company) => (
                      <div key={company.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-sm text-muted-foreground">{company.email}</p>
                            <p className="text-sm text-muted-foreground">{company.phone}</p>
                          </div>
                          <Button size="sm" variant="outline">Manage</Button>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full">Add New Company</Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No companies registered</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  System Analytics
                </CardTitle>
                <CardDescription>Platform usage and performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Property Occupancy Rate</span>
                    <span className="font-medium">
                      {totalProperties > 0 
                        ? Math.round((properties?.filter(p => p.status === 'occupied').length || 0) / totalProperties * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress value={totalProperties > 0 ? (properties?.filter(p => p.status === 'occupied').length || 0) / totalProperties * 100 : 0} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>User Activation Rate</span>
                    <span className="font-medium">
                      {totalUsers > 0 
                        ? Math.round((activeUsers / totalUsers) * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress value={totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Maintenance Response Time</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <Progress value={87} />
                </div>
                <div className="grid gap-4 md:grid-cols-3 mt-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">$0</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Active Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{totalCompanies}</p>
                      <p className="text-xs text-muted-foreground">Companies</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">System Uptime</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">99.9%</p>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>System-wide activity logs</CardDescription>
              </CardHeader>
              <CardContent>
                {activityLogs && activityLogs.length > 0 ? (
                  <div className="space-y-3">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.profiles?.first_name} {log.profiles?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">View All Activity</Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* System Health */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Storage Used</span>
                  <span className="text-sm font-medium">23%</span>
                </div>
                <Progress value={23} />
                <p className="text-xs text-muted-foreground">2.3 GB / 10 GB</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                API Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Avg Response Time</span>
                  <span className="text-sm font-medium">124ms</span>
                </div>
                <Progress value={75} />
                <p className="text-xs text-muted-foreground">Excellent performance</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="default" className="w-full justify-center">All Systems Operational</Badge>
                <div className="text-xs space-y-1 mt-3">
                  <div className="flex justify-between">
                    <span>Authentication</span>
                    <span className="text-green-500">●</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database</span>
                    <span className="text-green-500">●</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage</span>
                    <span className="text-green-500">●</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
