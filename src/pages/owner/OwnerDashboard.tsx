import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, DollarSign, AlertTriangle, TrendingUp, FileText, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const OwnerDashboard = () => {
  const { profile } = useAuth();

  const { data: properties } = useQuery({
    queryKey: ["owner-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("owner_id", profile?.id);
      if (error) throw error;
      return data;
    },
  });

  const { data: financialData } = useQuery({
    queryKey: ["owner-financials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("financial_transactions")
        .select("*, properties(name)")
        .in("property_id", properties?.map(p => p.id) || [])
        .order("transaction_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!properties?.length,
  });

  const { data: maintenanceRequests } = useQuery({
    queryKey: ["owner-maintenance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_requests")
        .select("*, properties(name)")
        .in("property_id", properties?.map(p => p.id) || [])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!properties?.length,
  });

  const totalRevenue = financialData
    ?.filter(t => t.transaction_type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalExpenses = financialData
    ?.filter(t => t.transaction_type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const netIncome = totalRevenue - totalExpenses;

  const pendingMaintenance = maintenanceRequests?.filter(
    r => r.status === "pending" || r.status === "in_progress"
  ).length || 0;

  const stats = [
    {
      title: "Total Properties",
      value: properties?.length || 0,
      icon: Building2,
      description: "Active properties",
      trend: "+0%",
    },
    {
      title: "Net Income",
      value: `$${netIncome.toLocaleString()}`,
      icon: DollarSign,
      description: "This month",
      trend: "+12.5%",
    },
    {
      title: "Pending Maintenance",
      value: pendingMaintenance,
      icon: AlertTriangle,
      description: "Requires attention",
      trend: "-8%",
    },
    {
      title: "Portfolio Value",
      value: `$${(properties?.reduce((sum, p) => sum + Number(p.current_value || 0), 0) || 0).toLocaleString()}`,
      icon: TrendingUp,
      description: "Total value",
      trend: "+5.2%",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Property Portfolio Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.first_name}! Here's your property overview.
          </p>
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
                <p className="text-xs text-green-600 mt-1">{stat.trend} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Financial Activity</CardTitle>
              <CardDescription>Latest transactions across your properties</CardDescription>
            </CardHeader>
            <CardContent>
              {financialData && financialData.length > 0 ? (
                <div className="space-y-4">
                  {financialData.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{transaction.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.properties?.name} • {new Date(transaction.transaction_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`font-bold ${transaction.transaction_type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.transaction_type === "income" ? "+" : "-"}${Number(transaction.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No financial activity yet</p>
              )}
              <Button asChild className="w-full mt-4">
                <Link to="/owner/financials">View All Transactions</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild className="w-full" variant="outline">
                  <Link to="/owner/properties">
                    <Building2 className="mr-2 h-4 w-4" />
                    Manage Properties
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/owner/documents">
                    <FileText className="mr-2 h-4 w-4" />
                    View Documents
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/owner/communications">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {maintenanceRequests && maintenanceRequests.length > 0 ? (
                  <div className="space-y-3">
                    {maintenanceRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="border-l-4 border-orange-500 pl-3">
                        <p className="font-medium text-sm">{request.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.properties?.name} • {request.status}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No pending maintenance</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
