import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, MapPin, IndianRupee, Calendar, User, GripVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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
    return `₹${amount.toLocaleString('en-IN')}`;
  }
};

const statusColors = {
  NEW: "bg-blue-100/50 text-blue-700 border-blue-200",
  QUALIFIED: "bg-purple-100/50 text-purple-700 border-purple-200",
  VISIT: "bg-orange-100/50 text-orange-700 border-orange-200",
  CLOSED: "bg-green-100/50 text-green-700 border-green-200",
  LOST: "bg-slate-100/50 text-slate-700 border-slate-200",
};

export function LeadCard({ lead, onCall, onWhatsApp, onClick }: LeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: {
      type: 'Lead',
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
    else window.open(`https://wa.me/${lead.buyerPhone.replace(/[^0-9]/g, '')}`, '_blank');
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`group relative cursor-default hover:shadow-xl transition-all duration-300 border border-slate-100 rounded-2xl overflow-hidden bg-white ${isDragging ? 'rotate-2 shadow-2xl ring-2 ring-primary/20' : ''}`}
      onClick={onClick}
    >
      {/* Interaction Layer */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:bg-slate-50 rounded-lg transition-all"
      >
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-black text-slate-800 line-clamp-1 text-sm tracking-tight leading-none mb-1">
              {lead.buyerName}
            </h4>
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter bg-slate-50 text-slate-400 border-slate-100 px-1.5 py-0">
                {lead.pdId}
              </Badge>
            </div>
          </div>
          <Badge className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm border-0 ${statusColors[lead.status]}`}>
            {lead.status}
          </Badge>
        </div>

        {/* Requirements */}
        <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed italic">
          "{lead.requirements}"
        </p>

        {/* Budget & Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-black text-primary bg-primary/5 px-2 py-1 rounded-lg">
            <IndianRupee className="h-3.5 w-3.5" />
            <span>{formatCurrency(lead.budget)}</span>
          </div>
          
          {lead.location && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1 max-w-[80px]">{lead.location}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
          <div className="flex items-center gap-2">
            {lead.assignedRep ? (
              <div className="flex items-center gap-1.5 ring-1 ring-slate-100 px-1.5 py-0.5 rounded-full bg-slate-50/50">
                <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-2 w-2 text-primary" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{lead.assignedRep.name}</span>
              </div>
            ) : (
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter italic">Unassigned</div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-xl"
              onClick={handleCall}
            >
              <Phone className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-green-50 text-whatsapp transition-colors rounded-xl"
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
