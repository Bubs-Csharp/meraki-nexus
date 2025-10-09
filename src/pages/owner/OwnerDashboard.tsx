import { useAuth } from "@/hooks/useAuth";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, DollarSign, AlertCircle, TrendingUp, FileText, MessageSquare, AlertTriangle, Receipt, Home, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const portfolioValue = properties?.reduce((sum, p) => sum + Number(p.current_value || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-primary">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-white space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Property Portfolio Overview
            </h1>
            <p className="text-xl text-white/90">
              Welcome back, {profile?.first_name}! Comprehensive insights into your property investments
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Real-time Financial Metrics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-gradient-primary text-white hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Portfolio Value</p>
                  <p className="text-3xl font-bold">${portfolioValue.toLocaleString()}</p>
                  <p className="text-xs text-white/80 mt-1">Total property value</p>
                </div>
                <DollarSign className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-success text-white hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Monthly Revenue</p>
                  <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-white/90 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +8.2% vs last month
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-accent text-accent-foreground hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm">Properties</p>
                  <p className="text-3xl font-bold">{properties?.length || 0}</p>
                  <p className="text-xs text-accent-foreground/80 mt-1">Active properties</p>
                </div>
                <Home className="w-8 h-8 text-accent-foreground/80" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-medium transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Occupancy</p>
                  <p className="text-3xl font-bold">94%</p>
                  <p className="text-xs text-muted-foreground mt-1">Average rate</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Health & Maintenance Alerts */}
        <Card className="shadow-soft hover:shadow-medium transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Property Health & Alerts
            </CardTitle>
            <CardDescription>Recent maintenance and inspection updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceRequests && maintenanceRequests.length > 0 ? (
                maintenanceRequests.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between border-b pb-3 last:border-0 hover:bg-muted/30 p-3 rounded-lg transition-smooth">
                    <div className="flex items-center gap-3">
                      <Badge className={
                        alert.priority === "high" ? "bg-destructive text-destructive-foreground" :
                        alert.priority === "medium" ? "bg-warning text-warning-foreground" :
                        "bg-success text-success-foreground"
                      }>
                        {alert.priority || 'normal'}
                      </Badge>
                      <div>
                        <p className="font-medium text-foreground">{alert.title}</p>
                        <p className="text-sm text-muted-foreground">{alert.properties?.name}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{alert.status}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">No pending maintenance</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Financial Activity */}
        <Card className="shadow-soft hover:shadow-medium transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Recent Financial Activity
            </CardTitle>
            <CardDescription>Latest transactions and rent payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData && financialData.length > 0 ? (
                financialData.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between hover:bg-muted/30 p-3 rounded-lg transition-smooth">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.transaction_type === "income" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      }`}>
                        {transaction.transaction_type === "income" ? <TrendingUp className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.category}</p>
                        <p className="text-sm text-muted-foreground">{transaction.properties?.name} • {new Date(transaction.transaction_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${transaction.transaction_type === "income" ? "text-success" : "text-destructive"}`}>
                      {transaction.transaction_type === "income" ? "+" : "-"}${Number(transaction.amount).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-8">No financial activity yet</p>
              )}
            </div>
            <Button asChild className="w-full mt-4">
              <Link to="/owner/financials">View All Transactions</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-soft hover:shadow-medium transition-smooth">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your properties and communications</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <Button asChild variant="outline" className="h-auto p-4 hover:shadow-soft transition-smooth">
              <Link to="/owner/properties" className="flex flex-col items-center text-center space-y-2">
                <Building2 className="w-5 h-5" />
                <div>
                  <div className="font-medium text-sm">Manage Properties</div>
                  <div className="text-xs opacity-80">View all properties</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 hover:shadow-soft transition-smooth">
              <Link to="/owner/documents" className="flex flex-col items-center text-center space-y-2">
                <FileText className="w-5 h-5" />
                <div>
                  <div className="font-medium text-sm">View Documents</div>
                  <div className="text-xs opacity-80">Access property files</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto p-4 hover:shadow-soft transition-smooth">
              <Link to="/owner/communications" className="flex flex-col items-center text-center space-y-2">
                <MessageSquare className="w-5 h-5" />
                <div>
                  <div className="font-medium text-sm">Messages</div>
                  <div className="text-xs opacity-80">Communication center</div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default OwnerDashboard;