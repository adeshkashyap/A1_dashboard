import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/lib/api-client";
import { LeadCard } from "./LeadCard";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  title: string;
  status: Lead['status'];
  leads: Lead[];
  color: string;
  onLeadClick?: (lead: Lead) => void;
}

export function KanbanColumn({ 
  title, 
  status, 
  leads, 
  color,
  onLeadClick 
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <Card className="border-0 shadow-sm mb-3">
        <CardHeader className="pb-3 border-b border-slate-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-slate-500">
              <div className={`h-2.5 w-2.5 rounded-full ${color} shadow-sm`} />
              {title}
            </CardTitle>
            <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-black px-2 shadow-inner">
              {leads.length}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-3 min-h-[200px] p-2 rounded-2xl border-2 border-dashed border-transparent transition-all duration-200",
          isOver ? "bg-slate-100/50 border-slate-200 scale-102" : "bg-transparent"
        )}
      >
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-xs font-black uppercase tracking-widest text-slate-300 gap-2 border-2 border-dashed border-slate-100 rounded-2xl">
            No leads in {title}
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
