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
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="space-y-2 sm:space-y-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground truncate">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 shrink-0 text-status-available" />
                ) : (
                  <TrendingDown className="h-4 w-4 shrink-0 text-destructive" />
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
                <span className="text-sm text-muted-foreground truncate">{changeLabel}</span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl shrink-0", iconBgColor)}>
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}