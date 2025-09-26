import { MapPin, DollarSign, Users, TrendingUp, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  image: string;
  monthlyRent: number;
  occupancyRate: number;
  tenants: number;
  maxTenants: number;
  status: "occupied" | "vacant" | "maintenance";
  lastUpdated: string;
}

const PropertyCard = ({
  title,
  address,
  image,
  monthlyRent,
  occupancyRate,
  tenants,
  maxTenants,
  status,
  lastUpdated,
}: PropertyCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-success text-success-foreground";
      case "vacant":
        return "bg-warning text-warning-foreground";
      case "maintenance":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-medium transition-smooth cursor-pointer group">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute top-3 left-3">
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button variant="ghost" size="icon" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
            <Camera className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-foreground text-lg">{title}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {address}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Monthly Rent</p>
                <p className="font-semibold text-foreground">${monthlyRent.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Occupancy</p>
                <p className="font-semibold text-foreground">{tenants}/{maxTenants}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">{occupancyRate}% Occupied</span>
            </div>
            <p className="text-xs text-muted-foreground">Updated {lastUpdated}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;