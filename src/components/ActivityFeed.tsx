import { Clock, Wrench, DollarSign, UserCheck, Camera, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  type: "maintenance" | "payment" | "tenant" | "inspection" | "alert";
  title: string;
  description: string;
  property: string;
  timestamp: string;
  status?: "pending" | "completed" | "in-progress";
}

const ActivityFeed = () => {
  const activities: Activity[] = [
    {
      id: "1",
      type: "payment",
      title: "Rent Payment Received",
      description: "Monthly rent payment from Tenant A",
      property: "Sunset Villa",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      type: "maintenance",
      title: "HVAC System Maintenance",
      description: "Annual HVAC inspection and cleaning scheduled",
      property: "Downtown Apartments",
      timestamp: "4 hours ago",
      status: "in-progress",
    },
    {
      id: "3",
      type: "inspection",
      title: "Property Inspection Completed",
      description: "Monthly walkthrough with photos uploaded",
      property: "Garden View Townhouse",
      timestamp: "1 day ago",
      status: "completed",
    },
    {
      id: "4",
      type: "alert",
      title: "Late Payment Notice",
      description: "Rent payment overdue by 5 days",
      property: "Ocean Breeze Condo",
      timestamp: "2 days ago",
      status: "pending",
    },
    {
      id: "5",
      type: "tenant",
      title: "New Tenant Application",
      description: "Background check and references verified",
      property: "Riverside Lodge",
      timestamp: "3 days ago",
      status: "completed",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "maintenance":
        return <Wrench className="w-4 h-4" />;
      case "payment":
        return <DollarSign className="w-4 h-4" />;
      case "tenant":
        return <UserCheck className="w-4 h-4" />;
      case "inspection":
        return <Camera className="w-4 h-4" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "maintenance":
        return "text-secondary bg-secondary/10";
      case "payment":
        return "text-success bg-success/10";
      case "tenant":
        return "text-primary bg-primary/10";
      case "inspection":
        return "text-accent bg-accent/10";
      case "alert":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted/10";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "in-progress":
        return "bg-warning text-warning-foreground";
      case "pending":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-smooth"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                {activity.status && (
                  <Badge className={getStatusColor(activity.status)} variant="outline">
                    {activity.status}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-primary">{activity.property}</span>
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;