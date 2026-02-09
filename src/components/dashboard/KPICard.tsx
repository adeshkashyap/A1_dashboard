import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  iconColor?: string;
  iconBgColor?: string;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel = "vs last month",
  icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
}: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1.5">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-status-available" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    isPositive ? "text-status-available" : "text-destructive"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {change}%
                </span>
                <span className="text-sm text-muted-foreground">{changeLabel}</span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", iconBgColor)}>
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}