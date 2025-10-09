import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, DollarSign, AlertCircle, TrendingUp, Calendar, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ManagerDashboard = () => {
  const { profile } = useAuth();

  // Fetch properties managed by this manager
  const { data: properties } = useQuery({
    queryKey: ['manager-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, profiles!properties_owner_id_fkey(first_name, last_name)')
        .eq('manager_id', profile?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  // Fetch maintenance requests
  const { data: maintenanceRequests } = useQuery({
    queryKey: ['manager-maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*, properties(name, address)')
        .in('property_id', properties?.map(p => p.id) || [])
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!properties?.length,
  });

  // Fetch communications
  const { data: communications } = useQuery({
    queryKey: ['manager-communications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('communications')
        .select('*, profiles!communications_sender_id_fkey(first_name, last_name)')
        .eq('recipient_id', profile?.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  const totalClients = new Set(properties?.map(p => p.owner_id)).size;
  const totalProperties = properties?.length || 0;
  const pendingMaintenance = maintenanceRequests?.filter(m => m.status === 'pending').length || 0;
  const unreadMessages = communications?.length || 0;

  const stats = [
    { title: "Total Clients", value: totalClients.toString(), icon: Users, description: "Active property owners", trend: "+2 this month" },
    { title: "Properties Under Management", value: totalProperties.toString(), icon: Building2, description: "All properties", trend: `${properties?.filter(p => p.status === 'occupied').length || 0} occupied` },
    { title: "Pending Tasks", value: pendingMaintenance.toString(), icon: AlertCircle, description: "Require attention", trend: "3 urgent" },
    { title: "Unread Messages", value: unreadMessages.toString(), icon: MessageSquare, description: "New communications", trend: "From clients" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Property Manager Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.first_name}! Here's your portfolio overview</p>
        </div>

        {/* Stats Grid */}
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
                <p className="text-xs text-primary mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Today's Priorities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Priorities
              </CardTitle>
              <CardDescription>Tasks requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              {maintenanceRequests && maintenanceRequests.length > 0 ? (
                <div className="space-y-3">
                  {maintenanceRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="text-sm font-medium">{request.title}</p>
                        <p className="text-xs text-muted-foreground">{request.properties?.name}</p>
                      </div>
                      <Badge variant={request.priority === 'high' ? 'destructive' : 'secondary'}>
                        {request.status}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="link" className="w-full">View All Tasks</Button>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No urgent tasks</p>
              )}
            </CardContent>
          </Card>

          {/* Client Communications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Client Communications
              </CardTitle>
              <CardDescription>Recent unread messages</CardDescription>
            </CardHeader>
            <CardContent>
              {communications && communications.length > 0 ? (
                <div className="space-y-3">
                  {communications.slice(0, 3).map((comm) => (
                    <div key={comm.id} className="border-b pb-2">
                      <p className="text-sm font-medium">{comm.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        From: {comm.profiles?.first_name} {comm.profiles?.last_name}
                      </p>
                    </div>
                  ))}
                  <Button variant="link" className="w-full">View All Messages</Button>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No new messages</p>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Occupancy Rate</span>
                  <span className="font-medium">
                    {totalProperties > 0 
                      ? Math.round((properties?.filter(p => p.status === 'occupied').length || 0) / totalProperties * 100)
                      : 0}%
                  </span>
                </div>
                <Progress value={totalProperties > 0 ? (properties?.filter(p => p.status === 'occupied').length || 0) / totalProperties * 100 : 0} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Maintenance Response</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Client Satisfaction</span>
                  <span className="font-medium">95%</span>
                </div>
                <Progress value={95} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Portfolio */}
        <Card>
          <CardHeader>
            <CardTitle>Properties Portfolio</CardTitle>
            <CardDescription>Quick overview of managed properties</CardDescription>
          </CardHeader>
          <CardContent>
            {properties && properties.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {properties.slice(0, 6).map((property) => (
                  <div key={property.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{property.name}</h4>
                      <Badge variant={property.status === 'occupied' ? 'default' : 'secondary'}>
                        {property.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{property.address}</p>
                    <div className="flex justify-between text-xs">
                      <span>Owner: {property.profiles?.first_name} {property.profiles?.last_name}</span>
                      <span className="font-medium">${property.monthly_rent || 0}/mo</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No properties under management</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ManagerDashboard;
