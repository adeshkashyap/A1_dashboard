import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const funnelData = [
  { stage: "New Leads", count: 156, color: "bg-lead-new", width: "100%" },
  { stage: "Contacted", count: 98, color: "bg-lead-contacted", width: "63%" },
  { stage: "Interested", count: 54, color: "bg-lead-interested", width: "35%" },
  { stage: "Negotiating", count: 28, color: "bg-lead-negotiating", width: "18%" },
  { stage: "Closed Won", count: 12, color: "bg-lead-closed", width: "8%" },
];

export function LeadFunnel() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Lead Funnel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {funnelData.map((item) => (
          <div key={item.stage} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.stage}</span>
              <span className="font-medium text-foreground">{item.count}</span>
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", item.color)}
                style={{ width: item.width }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}