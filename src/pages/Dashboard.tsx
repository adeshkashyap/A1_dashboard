import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { PropertyStatusChart } from "@/components/dashboard/PropertyStatusChart";
import { LeadFunnel } from "@/components/dashboard/LeadFunnel";
import { CreateLeadModal } from "@/components/leads/CreateLeadModal";
import { Building2, Users, IndianRupee, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { OnboardingTour } from "@/components/dashboard/OnboardingTour";

export default function Dashboard() {
  const [showCreateLead, setShowCreateLead] = useState(false);
  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['stats'],
    queryFn: () => api.stats.get(),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch recent leads
  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ['leads', 'recent'],
    queryFn: async () => {
      const allLeads = await api.leads.list();
      return allLeads.slice(0, 5); // Get 5 most recent
    },
    refetchInterval: 30000
  });

  // Fetch properties count
  const { data: properties } = useQuery({
    queryKey: ['properties', 'count'],
    queryFn: async () => {
      const allProperties = await api.properties.list();
      return allProperties.length;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  // Loading state
  if (statsLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (statsError) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-semibold">Failed to load dashboard data</p>
            <p className="text-sm text-muted-foreground mt-2">Please check your connection and try again</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      <OnboardingTour />
      <div className="space-y-6 animate-fade-in">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Properties"
            value={properties?.toString() || "0"}
            change={12}
            icon={<Building2 className="h-5 w-5" />}
            iconColor="text-chart-1"
            iconBgColor="bg-chart-1/10"
          />
          <KPICard
            title="New Leads Today"
            value={stats?.leadsToday?.toString() || "0"}
            change={8}
            icon={<Users className="h-5 w-5" />}
            iconColor="text-chart-2"
            iconBgColor="bg-chart-2/10"
          />
          <KPICard
            title="Pipeline Value"
            value={formatCurrency(stats?.pipelineValue || 0)}
            change={23}
            icon={<IndianRupee className="h-5 w-5" />}
            iconColor="text-chart-3"
            iconBgColor="bg-chart-3/10"
          />
          <KPICard
            title="Conversion Rate"
            value={`${stats?.conversionRate || 0}%`}
            change={stats?.conversionRate >= 50 ? 5 : -2}
            icon={<TrendingUp className="h-5 w-5" />}
            iconColor="text-chart-4"
            iconBgColor="bg-chart-4/10"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <PropertyStatusChart />
              <LeadFunnel />
            </div>
            
            {/* Recent Leads */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Leads</CardTitle>
              </CardHeader>
              <CardContent>
                {leadsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : leads && leads.length > 0 ? (
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="flex items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer min-w-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 min-w-0">
                            <span className="font-semibold truncate">{lead.buyerName}</span>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {lead.pdId}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {lead.requirements}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            Budget: {formatCurrency(lead.budget)}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge
                            variant={
                              lead.status === 'CLOSED' ? 'default' :
                              lead.status === 'QUALIFIED' ? 'secondary' :
                              lead.status === 'VISIT' ? 'outline' :
                              'destructive'
                            }
                          >
                            {lead.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
                            {lead.createdAt && formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No leads yet</p>
                    <p className="text-sm mt-1">New leads will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <QuickActions onAddClient={() => setShowCreateLead(true)} />
            
            {/* WhatsApp Status */}
            <Card className={stats?.whatsappStatus?.connected ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}>
              <CardHeader>
                <CardTitle className="text-sm">WhatsApp Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${stats?.whatsappStatus?.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="font-semibold">
                    {stats?.whatsappStatus?.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                {stats?.whatsappStatus?.connected && stats?.whatsappStatus?.me && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Number: +{stats.whatsappStatus.me}
                  </p>
                )}
                {!stats?.whatsappStatus?.connected && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Please connect WhatsApp to receive leads
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Today's Tasks */}
            <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
              <h3 className="font-semibold mb-2">Today's Tasks</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground/80" />
                  <span>{stats?.activeGroups || 0} site visits scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground/80" />
                  <span>{stats?.leadsToday || 0} new leads to follow up</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground/80" />
                  <span>{properties || 0} properties listed</span>
                </div>
              </div>
            </div>

            {/* Top Performing Rep */}
            {stats?.topRep && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Top Performer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-semibold">{stats.topRep.name}</p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {stats.topRep.conversionRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Create Lead Modal */}
      <CreateLeadModal open={showCreateLead} onOpenChange={setShowCreateLead} />
    </DashboardLayout>
  );
}