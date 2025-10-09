import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Users, Clock, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ManagerOperations = () => {
  const { profile } = useAuth();

  // Fetch contractors
  const { data: contractors } = useQuery({
    queryKey: ['contractors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractors')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });

  // Fetch properties for this manager
  const { data: properties } = useQuery({
    queryKey: ['manager-ops-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('manager_id', profile?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  // Fetch maintenance requests
  const { data: maintenance } = useQuery({
    queryKey: ['manager-ops-maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*, properties(name), contractors(name)')
        .in('property_id', properties?.map(p => p.id) || [])
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!properties?.length,
  });

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Operations Management</h1>
          <p className="text-muted-foreground">Coordinate property operations and vendor relationships</p>
        </div>

        <Tabs defaultValue="maintenance" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="contractors">Contractors</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance Requests
                </CardTitle>
                <CardDescription>Track and manage all maintenance activities</CardDescription>
              </CardHeader>
              <CardContent>
                {maintenance && maintenance.length > 0 ? (
                  <div className="space-y-4">
                    {maintenance.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{request.title}</h4>
                            <p className="text-sm text-muted-foreground">{request.properties?.name}</p>
                          </div>
                          <Badge variant={
                            request.status === 'completed' ? 'default' :
                            request.status === 'in_progress' ? 'secondary' :
                            'outline'
                          }>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm mb-3">{request.description}</p>
                        <div className="flex justify-between items-center">
                          <div className="space-y-1 text-sm">
                            {request.contractor_id && (
                              <p className="text-muted-foreground">
                                Contractor: {request.contractors?.name}
                              </p>
                            )}
                            {request.estimated_cost && (
                              <p className="text-muted-foreground">
                                Est. Cost: ${request.estimated_cost}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Assign</Button>
                            <Button size="sm">Update</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No maintenance requests</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contractors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contractor & Vendor Management
                </CardTitle>
                <CardDescription>Manage your network of service providers</CardDescription>
              </CardHeader>
              <CardContent>
                {contractors && contractors.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {contractors.map((contractor) => (
                      <div key={contractor.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{contractor.name}</h4>
                            <p className="text-sm text-muted-foreground">{contractor.specialty}</p>
                          </div>
                          {contractor.rating && (
                            <Badge variant="outline">
                              ⭐ {contractor.rating}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm mb-3">
                          <p className="text-muted-foreground">{contractor.phone}</p>
                          {contractor.email && (
                            <p className="text-muted-foreground">{contractor.email}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">Contact</Button>
                          <Button size="sm" variant="outline" className="flex-1">Assign Job</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No contractors registered</p>
                    <Button>Add Contractor</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Work Schedule
                </CardTitle>
                <CardDescription>Upcoming maintenance and inspections</CardDescription>
              </CardHeader>
              <CardContent>
                {maintenance && maintenance.filter(m => m.scheduled_date).length > 0 ? (
                  <div className="space-y-4">
                    {maintenance
                      .filter(m => m.scheduled_date)
                      .sort((a, b) => new Date(a.scheduled_date!).getTime() - new Date(b.scheduled_date!).getTime())
                      .map((request) => (
                        <div key={request.id} className="flex items-center justify-between border-b pb-3">
                          <div>
                            <p className="font-medium">{request.title}</p>
                            <p className="text-sm text-muted-foreground">{request.properties?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(request.scheduled_date!).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge>{request.status}</Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No scheduled work</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ManagerOperations;
