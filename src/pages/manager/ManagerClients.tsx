import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Phone, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const ManagerClients = () => {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all properties managed by this manager to get unique clients
  const { data: properties } = useQuery({
    queryKey: ['manager-client-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*, profiles!properties_owner_id_fkey(id, first_name, last_name, email, phone)')
        .eq('manager_id', profile?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  // Group properties by owner (client)
  const clients = properties?.reduce((acc, property) => {
    const ownerId = property.owner_id;
    if (!acc[ownerId]) {
      acc[ownerId] = {
        owner: property.profiles,
        properties: [],
        totalValue: 0,
        totalRent: 0,
      };
    }
    acc[ownerId].properties.push(property);
    acc[ownerId].totalValue += property.current_value || 0;
    acc[ownerId].totalRent += property.monthly_rent || 0;
    return acc;
  }, {} as Record<string, any>);

  const clientList = clients ? Object.values(clients) : [];

  const filteredClients = clientList.filter((client: any) =>
    `${client.owner?.first_name} ${client.owner?.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Client Management</h1>
          <p className="text-muted-foreground">Manage your property owner relationships</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Client Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client: any) => (
            <Card key={client.owner.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{client.owner.first_name} {client.owner.last_name}</CardTitle>
                    <CardDescription>{client.properties.length} {client.properties.length === 1 ? 'Property' : 'Properties'}</CardDescription>
                  </div>
                  <Badge>{client.properties.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {client.owner.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{client.owner.email}</span>
                    </div>
                  )}
                  {client.owner.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.owner.phone}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Portfolio Value</span>
                    <span className="font-bold">${client.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Rent</span>
                    <span className="font-bold text-primary">${client.totalRent.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Properties:</p>
                  {client.properties.slice(0, 3).map((property: any) => (
                    <div key={property.id} className="flex items-center gap-2 text-sm">
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{property.name}</span>
                      <Badge variant="outline" className="text-xs">{property.status}</Badge>
                    </div>
                  ))}
                  {client.properties.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{client.properties.length - 3} more</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="h-3 w-3 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No clients found</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ManagerClients;
