import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/lib/api-client";
import { LeadCard } from "./LeadCard";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  title: string;
  status: Lead["status"];
  leads: Lead[];
  color: string;
  onLeadClick?: (lead: Lead) => void;
}

export function KanbanColumn({
  title,
  status,
  leads,
  color,
  onLeadClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col h-full w-[260px] sm:w-[280px] shrink-0 snap-start">
      <Card className="border-0 shadow-sm mb-3 bg-card">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 text-muted-foreground min-w-0">
              <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", color)} />
              <span className="truncate">{title}</span>
            </CardTitle>
            <Badge variant="secondary" className="shrink-0 font-semibold px-2">
              {leads.length}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-3 min-h-[200px] max-h-[calc(100vh-320px)] overflow-y-auto p-2 rounded-2xl border-2 border-dashed border-transparent transition-all duration-200",
          isOver ? "bg-muted/50 border-border" : "bg-transparent"
        )}
      >
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 gap-2 border-2 border-dashed border-border rounded-2xl px-3 text-center">
            No leads here
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={() => onLeadClick?.(lead)}
            />
          ))
        )}
      </div>
    </div>
  );
}
