import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Edit, Trash2, TrendingUp, Users } from "lucide-react";
import type { SalesRep } from "@/lib/api-client";

interface SalesRepCardProps {
  rep: SalesRep;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SalesRepCard({ rep, onEdit, onDelete }: SalesRepCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{rep.name}</h3>
            <Badge variant={rep.active ? "default" : "secondary"} className="mt-1">
              {rep.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={onEdit}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onDelete}
              title="Delete"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{rep.phone}</span>
          </div>
          {rep.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{rep.email}</span>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>Leads Handled</span>
            </div>
            <p className="text-2xl font-bold">{rep.leadsHandled || 0}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Conversion</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {rep.conversionRate || 0}%
            </p>
          </div>
        </div>

        {/* Commission & Target */}
        {(rep.commission || rep.monthlyTarget) && (
          <div className="grid grid-cols-2 gap-4 pt-3 border-t text-sm">
            {rep.commission && (
              <div>
                <p className="text-xs text-muted-foreground">Commission</p>
                <p className="font-semibold">{rep.commission}%</p>
              </div>
            )}
            {rep.monthlyTarget && (
              <div>
                <p className="text-xs text-muted-foreground">Monthly Target</p>
                <p className="font-semibold">₹{(rep.monthlyTarget / 100000).toFixed(1)}L</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
