import { Plus, FileText, Users, Wrench, BarChart3, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuickActions = () => {
  const actions = [
    {
      title: "Add Property",
      description: "Register a new property to your portfolio",
      icon: <Plus className="w-5 h-5" />,
      variant: "default" as const,
    },
    {
      title: "Generate Report",
      description: "Create monthly financial and activity reports",
      icon: <FileText className="w-5 h-5" />,
      variant: "secondary" as const,
    },
    {
      title: "Screen Tenant",
      description: "Run background checks and verify references",
      icon: <Users className="w-5 h-5" />,
      variant: "success" as const,
    },
    {
      title: "Schedule Maintenance",
      description: "Book inspections and repair services",
      icon: <Wrench className="w-5 h-5" />,
      variant: "warning" as const,
    },
    {
      title: "View Analytics",
      description: "Analyze property performance and trends",
      icon: <BarChart3 className="w-5 h-5" />,
      variant: "accent" as const,
    },
    {
      title: "Upload Photos",
      description: "Add property inspection photos and videos",
      icon: <Camera className="w-5 h-5" />,
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-auto p-4 flex flex-col items-center text-center space-y-2"
            >
              {action.icon}
              <div>
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;