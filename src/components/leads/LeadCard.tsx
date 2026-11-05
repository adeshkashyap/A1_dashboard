import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, MapPin, IndianRupee, User, GripVertical } from "lucide-react";
import type { Lead } from "@/lib/api-client";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface LeadCardProps {
  lead: Lead;
  onCall?: (phone: string) => void;
  onWhatsApp?: (phone: string) => void;
  onClick?: () => void;
}

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
};

const statusColors = {
  NEW: "bg-chart-1/15 text-chart-1 border-chart-1/30",
  QUALIFIED: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  VISIT: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  CLOSED: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  LOST: "bg-muted text-muted-foreground border-border",
};

export function LeadCard({ lead, onCall, onWhatsApp, onClick }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: {
      type: "Lead",
      lead,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : undefined,
    zIndex: isDragging ? 50 : undefined,
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCall) onCall(lead.buyerPhone);
    else window.location.href = `tel:${lead.buyerPhone}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWhatsApp) onWhatsApp(lead.buyerPhone);
    else
      window.open(
        `https://wa.me/${lead.buyerPhone.replace(/[^0-9]/g, "")}`,
        "_blank"
      );
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group relative cursor-default hover:shadow-md transition-all duration-300 border border-border rounded-2xl overflow-hidden bg-card ${
        isDragging ? "rotate-2 shadow-2xl ring-2 ring-primary/20" : ""
      }`}
      onClick={onClick}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:bg-muted rounded-lg transition-all z-10"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2 min-w-0 pr-8">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate text-sm leading-tight mb-1">
              {lead.buyerName}
            </h4>
            <Badge
              variant="outline"
              className="text-[10px] font-medium uppercase tracking-tight px-1.5 py-0"
            >
              {lead.pdId}
            </Badge>
          </div>
          <Badge
            className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0 border ${statusColors[lead.status]}`}
          >
            {lead.status}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {lead.requirements}
        </p>

        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1 text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg shrink-0">
            <IndianRupee className="h-3.5 w-3.5" />
            <span>{formatCurrency(lead.budget)}</span>
          </div>

          {lead.location && (
            <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground min-w-0">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-[100px]">{lead.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
          <div className="flex items-center gap-2 min-w-0">
            {lead.assignedRep ? (
              <div className="flex items-center gap-1.5 ring-1 ring-border px-1.5 py-0.5 rounded-full bg-muted/50 min-w-0">
                <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-2 w-2 text-primary" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[90px]">
                  {lead.assignedRep.name}
                </span>
              </div>
            ) : (
              <div className="text-[10px] font-medium text-muted-foreground/60 italic">
                Unassigned
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-xl"
              onClick={handleCall}
            >
              <Phone className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-whatsapp rounded-xl"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
