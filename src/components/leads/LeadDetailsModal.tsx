import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api, { type Lead } from "@/lib/api-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  IndianRupee, 
  Calendar,
  User,
  Loader2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface LeadDetailsModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  NEW: "bg-blue-100 text-blue-700",
  QUALIFIED: "bg-purple-100 text-purple-700",
  VISIT: "bg-orange-100 text-orange-700",
  CLOSED: "bg-green-100 text-green-700",
  LOST: "bg-gray-100 text-gray-700",
};

export function LeadDetailsModal({ lead, open, onOpenChange }: LeadDetailsModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<Lead['status'] | ''>('');

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: Lead['status']) => {
      if (!lead) return;
      return api.leads.update(lead.id, { status: newStatus });
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Lead status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      setSelectedStatus('');
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!lead) return null;

  const handleStatusChange = (newStatus: Lead['status']) => {
    setSelectedStatus(newStatus);
    updateStatusMutation.mutate(newStatus);
  };

  const handleCall = () => {
    window.location.href = `tel:${lead.buyerPhone}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${lead.buyerPhone.replace(/[^0-9]/g, '')}`, '_blank');
  };

  const handleEmail = () => {
    if (lead.buyerEmail) {
      window.location.href = `mailto:${lead.buyerEmail}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{lead.buyerName}</DialogTitle>
              <DialogDescription className="mt-1">
                Lead ID: {lead.pdId}
              </DialogDescription>
            </div>
            <Badge className={statusColors[lead.status]}>
              {lead.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Contact Information</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{lead.buyerPhone}</span>
                <Button size="sm" variant="outline" onClick={handleCall}>
                  Call
                </Button>
                <Button size="sm" variant="outline" onClick={handleWhatsApp}>
                  <MessageCircle className="h-3.5 w-3.5 mr-1" />
                  WhatsApp
                </Button>
              </div>

              {lead.buyerEmail && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.buyerEmail}</span>
                  <Button size="sm" variant="outline" onClick={handleEmail}>
                    Email
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Requirements */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Requirements</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {lead.requirements}
            </p>
          </div>

          <Separator />

          {/* Budget & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Budget</h3>
              <div className="flex items-center gap-1 text-lg font-bold text-primary">
                <IndianRupee className="h-4 w-4" />
                <span>{formatCurrency(lead.budget)}</span>
              </div>
            </div>

            {lead.location && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Location</h3>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.location}</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Assigned Rep */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Assigned Sales Rep</h3>
            {lead.assignedRep ? (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{lead.assignedRep.name}</span>
                <Badge variant="outline" className="text-xs">
                  {lead.assignedRep.phone}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not assigned</p>
            )}
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Timeline</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Created {lead.createdAt && formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                </span>
              </div>
              {lead.updatedAt && lead.updatedAt !== lead.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Updated {formatDistanceToNow(new Date(lead.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Update Status */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Update Status</h3>
            <Select 
              value={selectedStatus || lead.status} 
              onValueChange={(value) => handleStatusChange(value as Lead['status'])}
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="QUALIFIED">Qualified</SelectItem>
                <SelectItem value="VISIT">Visit Scheduled</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="LOST">Lost</SelectItem>
              </SelectContent>
            </Select>
            {updateStatusMutation.isPending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating status...</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
