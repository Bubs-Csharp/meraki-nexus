import { useState } from "react";
import { Building2, Plus, Eye, BarChart3 } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import PropertyCard from "@/components/PropertyCard";
import FinancialSummary from "@/components/FinancialSummary";
import ActivityFeed from "@/components/ActivityFeed";
import QuickActions from "@/components/QuickActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import heroProperty from "@/assets/hero-property.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const Dashboard = () => {
  const properties = [
    {
      id: "1",
      title: "Sunset Villa",
      address: "123 Ocean Drive, Miami Beach",
      image: property1,
      monthlyRent: 4500,
      occupancyRate: 100,
      tenants: 1,
      maxTenants: 1,
      status: "occupied" as const,
      lastUpdated: "2 days ago",
    },
    {
      id: "2",
      title: "Downtown Apartments",
      address: "456 City Center Blvd, Downtown",
      image: property2,
      monthlyRent: 8900,
      occupancyRate: 75,
      tenants: 6,
      maxTenants: 8,
      status: "occupied" as const,
      lastUpdated: "1 week ago",
    },
    {
      id: "3",
      title: "Garden View Townhouse",
      address: "789 Green Valley Road, Suburbs",
      image: property3,
      monthlyRent: 2200,
      occupancyRate: 0,
      tenants: 0,
      maxTenants: 1,
      status: "maintenance" as const,
      lastUpdated: "3 days ago",
    },
  ];

  const totalProperties = properties.length;
  const totalRevenue = properties.reduce((sum, property) => 
    sum + (property.monthlyRent * (property.occupancyRate / 100)), 0
  );
  const averageOccupancy = Math.round(
    properties.reduce((sum, property) => sum + property.occupancyRate, 0) / totalProperties
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-primary">
        <div className="absolute inset-0 bg-black/20"></div>
        <img
          src={heroProperty}
          alt="Property Management Hero"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-white space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Trusted Property Management
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Comprehensive management for diaspora property owners with radical transparency and peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" variant="accent" className="shadow-strong">
                <Plus className="w-5 h-5 mr-2" />
                Add New Property
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20">
                <Eye className="w-5 h-5 mr-2" />
                View All Reports
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-primary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Properties</p>
                  <p className="text-3xl font-bold">{totalProperties}</p>
                </div>
                <Building2 className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-success text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Monthly Revenue</p>
                  <p className="text-3xl font-bold">${Math.round(totalRevenue).toLocaleString()}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-white/80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-accent text-accent-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm">Avg. Occupancy</p>
                  <p className="text-3xl font-bold">{averageOccupancy}%</p>
                </div>
                <Eye className="w-8 h-8 text-accent-foreground/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
          <QuickActions />
        </div>

        {/* Financial Summary */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Financial Overview</h2>
          <FinancialSummary />
        </div>

        {/* Properties and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Property Portfolio */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Property Portfolio</h2>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;