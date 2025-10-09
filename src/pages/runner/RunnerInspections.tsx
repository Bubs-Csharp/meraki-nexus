import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle, FileText, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

const RunnerInspections = () => {
  const { profile } = useAuth();

  // Fetch inspections for this runner
  const { data: inspections } = useQuery({
    queryKey: ['runner-all-inspections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspections')
        .select('*, properties(name, address)')
        .eq('runner_id', profile?.id)
        .order('inspection_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  const pendingInspections = inspections?.filter(i => !i.checklist_completed) || [];
  const completedInspections = inspections?.filter(i => i.checklist_completed) || [];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Property Inspections</h1>
          <p className="text-muted-foreground">Manage and document property inspections</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingInspections.length}</p>
              <p className="text-xs text-muted-foreground">Incomplete inspections</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{completedInspections.length}</p>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {inspections?.reduce((sum, i) => sum + ((i.images as any[])?.length || 0), 0) || 0}
              </p>
              <p className="text-xs text-muted-foreground">Total uploaded</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Inspections */}
        {pendingInspections.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Inspections
              </CardTitle>
              <CardDescription>Inspections requiring completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingInspections.map((inspection) => (
                  <div key={inspection.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{inspection.properties?.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {inspection.properties?.address}
                        </p>
                      </div>
                      <Badge variant="outline">{inspection.inspection_type}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <p>Date: {format(new Date(inspection.inspection_date), 'MMM dd, yyyy')}</p>
                        <p>{(inspection.images as any[])?.length || 0} photos uploaded</p>
                      </div>
                      <Button size="sm">
                        <FileText className="h-3 w-3 mr-1" />
                        Complete Inspection
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Inspections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Completed Inspections
            </CardTitle>
            <CardDescription>Inspection history</CardDescription>
          </CardHeader>
          <CardContent>
            {completedInspections.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {completedInspections.map((inspection) => (
                  <div key={inspection.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{inspection.properties?.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(inspection.inspection_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <Badge variant="default" className="text-xs">
                        {inspection.inspection_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Camera className="h-3 w-3" />
                      <span>{(inspection.images as any[])?.length || 0} photos</span>
                      {(inspection.findings as any[])?.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{(inspection.findings as any[])?.length} findings</span>
                        </>
                      )}
                    </div>
                    {inspection.notes && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{inspection.notes}</p>
                    )}
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">No completed inspections</p>
            )}
          </CardContent>
        </Card>

        {/* New Inspection Button */}
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8">
          <Button size="lg" className="shadow-lg">
            <Camera className="h-5 w-5 mr-2" />
            New Inspection
          </Button>
        </div>
      </main>
    </div>
  );
};

export default RunnerInspections;
