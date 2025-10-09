import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, DollarSign, AlertCircle, TrendingUp, Calendar, MessageSquare, CheckCircle } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-primary">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-white space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Manager Executive Dashboard
            </h1>
            <p className="text-xl text-white/90">
              Welcome back, {profile?.first_name}! Comprehensive oversight of all properties and client portfolios
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Performance Metrics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-primary text-white hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Active Clients</p>
                  <p className="text-3xl font-bold">{totalClients}</p>
                  <p className="text-xs text-white/80 mt-1">Property owners</p>
                </div>
                <Users className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-success text-white hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Properties</p>
                  <p className="text-3xl font-bold">{totalProperties}</p>
                  <p className="text-xs text-white/90 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +3 this month
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-accent text-accent-foreground hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm">Tasks Completed</p>
                  <p className="text-3xl font-bold">142</p>
                  <p className="text-xs text-accent-foreground/80 mt-1">This month</p>
                </div>
                <CheckCircle className="w-8 h-8 text-accent-foreground/80" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Revenue</p>
                  <p className="text-3xl font-bold">$284K</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% vs last month
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Today's Priorities */}
          <Card className="shadow-soft hover:shadow-medium transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Priorities
              </CardTitle>
              <CardDescription>Tasks requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              {maintenanceRequests && maintenanceRequests.length > 0 ? (
                <div className="space-y-3">
                  {maintenanceRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between border-b pb-2 hover:bg-muted/30 p-2 rounded-lg transition-smooth">
                      <div>
                        <p className="text-sm font-medium">{request.title}</p>
                        <p className="text-xs text-muted-foreground">{request.properties?.name}</p>
                      </div>
                      <Badge className={request.priority === 'high' ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-secondary-foreground'}>
                        {request.status}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="link" className="w-full">View All Tasks</Button>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">No urgent tasks</p>
              )}
            </CardContent>
          </Card>

          {/* Client Communications */}
          <Card className="shadow-soft hover:shadow-medium transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Client Communications
              </CardTitle>
              <CardDescription>Recent unread messages</CardDescription>
            </CardHeader>
            <CardContent>
              {communications && communications.length > 0 ? (
                <div className="space-y-3">
                  {communications.slice(0, 3).map((comm) => (
                    <div key={comm.id} className="border-b pb-2 hover:bg-muted/30 p-2 rounded-lg transition-smooth">
                      <p className="text-sm font-medium">{comm.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        From: {comm.profiles?.first_name} {comm.profiles?.last_name}
                      </p>
                    </div>
                  ))}
                  <Button variant="link" className="w-full">View All Messages</Button>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">No new messages</p>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="shadow-soft hover:shadow-medium transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
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
        <Card className="shadow-soft hover:shadow-medium transition-smooth">
          <CardHeader>
            <CardTitle>Properties Portfolio</CardTitle>
            <CardDescription>Quick overview of managed properties</CardDescription>
          </CardHeader>
          <CardContent>
            {properties && properties.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {properties.slice(0, 6).map((property) => (
                  <div key={property.id} className="border rounded-lg p-4 hover:shadow-soft transition-smooth">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{property.name}</h4>
                      <Badge className={property.status === 'occupied' ? 'bg-success text-success-foreground' : 'bg-secondary text-secondary-foreground'}>
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
              <p className="text-muted-foreground text-sm text-center py-8">No properties under management</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ManagerDashboard;
