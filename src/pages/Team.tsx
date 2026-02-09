import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api, { type SalesRep } from "@/lib/api-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesRepCard } from "@/components/team/SalesRepCard";
import { SalesRepModal } from "@/components/team/SalesRepModal";
import { DeleteSalesRepDialog } from "@/components/team/DeleteSalesRepDialog";
import { 
  Search, 
  Plus, 
  Loader2, 
  AlertCircle, 
  Users,
  TrendingUp,
  Award,
  Target
} from "lucide-react";

export default function Team() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRep, setEditingRep] = useState<SalesRep | null>(null);
  const [deletingRep, setDeletingRep] = useState<SalesRep | null>(null);
  const [showAddRep, setShowAddRep] = useState(false);

  // Fetch sales reps
  const { data: salesReps, isLoading, error } = useQuery({
    queryKey: ['salesReps'],
    queryFn: () => api.salesReps.list(),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch leads to calculate metrics
  const { data: leads } = useQuery({
    queryKey: ['leads'],
    queryFn: () => api.leads.list(),
  });

  // Calculate metrics for each rep
  const repsWithMetrics = (salesReps || []).map(rep => {
    const repLeads = (leads || []).filter(lead => lead.assignedRepId === rep.id);
    const closedLeads = repLeads.filter(lead => lead.status === 'CLOSED');
    
    return {
      ...rep,
      leadsHandled: repLeads.length,
      conversionRate: repLeads.length > 0 
        ? Math.round((closedLeads.length / repLeads.length) * 100)
        : 0,
    };
  });

  // Filter reps
  const filteredReps = repsWithMetrics.filter((rep) =>
    rep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rep.phone.includes(searchQuery) ||
    rep.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate team stats
  const activeReps = repsWithMetrics.filter(r => r.active).length;
  const totalLeads = repsWithMetrics.reduce((sum, r) => sum + (r.leadsHandled || 0), 0);
  const avgConversion = repsWithMetrics.length > 0
    ? Math.round(repsWithMetrics.reduce((sum, r) => sum + (r.conversionRate || 0), 0) / repsWithMetrics.length)
    : 0;
  const topPerformer = repsWithMetrics.reduce((top, rep) => 
    (rep.conversionRate || 0) > (top.conversionRate || 0) ? rep : top
  , repsWithMetrics[0]);

  return (
    <DashboardLayout title="Sales Team">
      <div className="space-y-6 animate-fade-in">
        {/* Team Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Reps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-chart-1" />
                <span className="text-2xl font-bold">{activeReps}</span>
                <span className="text-sm text-muted-foreground">
                  / {repsWithMetrics.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Leads Handled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-chart-2" />
                <span className="text-2xl font-bold">{totalLeads}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Conversion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-chart-3" />
                <span className="text-2xl font-bold">{avgConversion}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-chart-4" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {topPerformer?.name || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {topPerformer?.conversionRate || 0}% conversion
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header & Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sales reps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Button onClick={() => setShowAddRep(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Sales Rep
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading sales team...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive font-semibold">Failed to load sales team</p>
              <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
            </div>
          </div>
        )}

        {/* Sales Reps Grid */}
        {!isLoading && !error && (
          <>
            {filteredReps.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery ? "No reps found" : "No sales reps yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? "Try adjusting your search criteria" 
                    : "Add your first sales representative to get started"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowAddRep(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sales Rep
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredReps.map((rep) => (
                  <SalesRepCard
                    key={rep.id}
                    rep={rep}
                    onEdit={() => setEditingRep(rep)}
                    onDelete={() => setDeletingRep(rep)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <SalesRepModal
        rep={editingRep}
        open={!!editingRep || showAddRep}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRep(null);
            setShowAddRep(false);
          }
        }}
      />
      <DeleteSalesRepDialog
        rep={deletingRep}
        open={!!deletingRep}
        onOpenChange={(open) => !open && setDeletingRep(null)}
      />
    </DashboardLayout>
  );
}