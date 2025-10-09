import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, CheckCircle, Clock, Camera, Navigation, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const RunnerDashboard = () => {
  const { profile } = useAuth();

  // Fetch assigned properties
  const { data: properties } = useQuery({
    queryKey: ['runner-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('runner_id', profile?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  // Fetch maintenance requests assigned to runner
  const { data: maintenanceRequests } = useQuery({
    queryKey: ['runner-maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*, properties(name, address)')
        .eq('runner_id', profile?.id)
        .order('scheduled_date', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  // Fetch inspections
  const { data: inspections } = useQuery({
    queryKey: ['runner-inspections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspections')
        .select('*, properties(name, address)')
        .eq('runner_id', profile?.id)
        .order('inspection_date', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  const todayVisits = maintenanceRequests?.filter(m => 
    m.scheduled_date === format(new Date(), 'yyyy-MM-dd')
  ).length || 0;

  const completedTasks = maintenanceRequests?.filter(m => 
    m.status === 'completed'
  ).length || 0;

  const pendingTasks = maintenanceRequests?.filter(m => 
    m.status === 'in_progress' || m.status === 'pending'
  ).length || 0;

  const totalPhotos = inspections?.reduce((sum, inspection) => 
    sum + ((inspection.images as any[])?.length || 0), 0
  ) || 0;

  const stats = [
    { title: "Today's Visits", value: todayVisits.toString(), icon: MapPin, description: "Scheduled for today", color: "text-blue-500" },
    { title: "Completed Tasks", value: completedTasks.toString(), icon: CheckCircle, description: "This week", color: "text-green-500" },
    { title: "Pending Tasks", value: pendingTasks.toString(), icon: Clock, description: "Active assignments", color: "text-orange-500" },
    { title: "Photos Uploaded", value: totalPhotos.toString(), icon: Camera, description: "This month", color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-primary">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-white space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Field Operations</h1>
            <p className="text-xl text-white/90">Hello, {profile?.first_name}! Mobile-optimized tools for on-site property management</p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-primary text-white hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Today's Visits</p>
                  <p className="text-3xl font-bold">{todayVisits}</p>
                  <p className="text-xs text-white/80 mt-1">Properties scheduled</p>
                </div>
                <MapPin className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-success text-white hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Completed</p>
                  <p className="text-3xl font-bold">{completedTasks}</p>
                  <p className="text-xs text-white/80 mt-1">This week</p>
                </div>
                <CheckCircle className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-accent text-accent-foreground hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm">Pending Tasks</p>
                  <p className="text-3xl font-bold">{pendingTasks}</p>
                  <p className="text-xs text-accent-foreground/80 mt-1">Active assignments</p>
                </div>
                <Clock className="w-8 h-8 text-accent-foreground/80" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Photos</p>
                  <p className="text-3xl font-bold">{totalPhotos}</p>
                  <p className="text-xs text-muted-foreground mt-1">Uploaded this month</p>
                </div>
                <Camera className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 mb-8 grid-cols-2 md:grid-cols-4">
          <Button className="h-20 flex flex-col gap-2">
            <Upload className="h-5 w-5" />
            <span className="text-xs">Quick Upload</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <Navigation className="h-5 w-5" />
            <span className="text-xs">Start Route</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="text-xs">Inspection</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col gap-2">
            <Camera className="h-5 w-5" />
            <span className="text-xs">Take Photo</span>
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Route */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Today's Route
              </CardTitle>
              <CardDescription>Optimized visit sequence</CardDescription>
            </CardHeader>
            <CardContent>
              {maintenanceRequests && maintenanceRequests.filter(m => 
                m.scheduled_date === format(new Date(), 'yyyy-MM-dd')
              ).length > 0 ? (
                <div className="space-y-3">
                  {maintenanceRequests
                    .filter(m => m.scheduled_date === format(new Date(), 'yyyy-MM-dd'))
                    .map((request, index) => (
                      <div key={request.id} className="flex gap-3 border-b pb-3 last:border-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{request.properties?.name}</p>
                          <p className="text-xs text-muted-foreground">{request.properties?.address}</p>
                          <p className="text-xs mt-1">{request.title}</p>
                          <Badge variant="outline" className="mt-1">
                            {request.priority || 'normal'} priority
                          </Badge>
                        </div>
                      </div>
                    ))}
                  <Button variant="outline" className="w-full">
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate Route
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm">No visits scheduled for today</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Maintenance Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Active Maintenance Tasks
              </CardTitle>
              <CardDescription>Current assignments</CardDescription>
            </CardHeader>
            <CardContent>
              {maintenanceRequests && maintenanceRequests.filter(m => 
                m.status === 'in_progress' || m.status === 'pending'
              ).length > 0 ? (
                <div className="space-y-3">
                  {maintenanceRequests
                    .filter(m => m.status === 'in_progress' || m.status === 'pending')
                    .slice(0, 5)
                    .map((request) => (
                      <div key={request.id} className="border-b pb-3 last:border-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium text-sm">{request.title}</p>
                          <Badge variant={request.status === 'in_progress' ? 'default' : 'secondary'}>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{request.properties?.name}</p>
                        {request.scheduled_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {format(new Date(request.scheduled_date), 'MMM dd, yyyy')}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            Update Status
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            <Camera className="h-3 w-3 mr-1" />
                            Add Photo
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm">No active tasks</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Inspections */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Inspections</CardTitle>
            <CardDescription>Latest property inspections</CardDescription>
          </CardHeader>
          <CardContent>
            {inspections && inspections.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inspections.slice(0, 6).map((inspection) => (
                  <div key={inspection.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{inspection.properties?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(inspection.inspection_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <Badge variant={inspection.checklist_completed ? 'default' : 'secondary'}>
                        {inspection.inspection_type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {(inspection.images as any[])?.length || 0} photos
                    </p>
                    {inspection.checklist_completed && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No inspections recorded</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RunnerDashboard;
