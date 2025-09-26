import { DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinancialMetric {
  title: string;
  amount: number;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down";
}

const FinancialSummary = () => {
  const metrics: FinancialMetric[] = [
    {
      title: "Monthly Revenue",
      amount: 15420,
      change: 8.2,
      icon: <DollarSign className="w-5 h-5" />,
      trend: "up",
    },
    {
      title: "Total Expenses",
      amount: 3240,
      change: -12.5,
      icon: <PieChart className="w-5 h-5" />,
      trend: "down",
    },
    {
      title: "Net Profit",
      amount: 12180,
      change: 15.3,
      icon: <TrendingUp className="w-5 h-5" />,
      trend: "up",
    },
    {
      title: "Outstanding Rent",
      amount: 2400,
      change: -5.8,
      icon: <TrendingDown className="w-5 h-5" />,
      trend: "down",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-medium transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              {metric.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                ${metric.amount.toLocaleString()}
              </div>
              <div className="flex items-center space-x-1">
                {metric.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span
                  className={`text-sm font-medium ${
                    metric.trend === "up" ? "text-success" : "text-destructive"
                  }`}
                >
                  {metric.change > 0 ? "+" : ""}{metric.change}%
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FinancialSummary;