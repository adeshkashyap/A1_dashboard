import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api, { type Lead } from "@/lib/api-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KanbanColumn } from "@/components/leads/KanbanColumn";
import { LeadDetailsModal } from "@/components/leads/LeadDetailsModal";
import { CreateLeadModal } from "@/components/leads/CreateLeadModal";
import { Search, Plus, Loader2, AlertCircle, LayoutGrid, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  defaultAnnouncements,
} from "@dnd-kit/core";
import { LeadCard } from "@/components/leads/LeadCard";

type ViewMode = "kanban" | "list";

export default function Leads() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [repFilter, setRepFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch leads with infinite scroll
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['leads'],
    queryFn: ({ pageParam = 1 }) => api.leads.list(pageParam as number, 20),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < 20 ? undefined : allPages.length + 1;
    },
    initialPageParam: 1,
  });

  const allLeads = data?.pages.flat() || [];

  // Audio for new lead notification
  const playNotificationSound = () => {
    try {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.volume = 0.5;
      audio.play();
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  };

  // Real-time updates via Socket.io
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNewLead = (newLead: Lead) => {
      playNotificationSound();
      toast({
        title: "New Lead Created! ⚡",
        description: `${newLead.buyerName} inquiring about properties.`,
      });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      // Also update stats if they are visible
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    };

    const handleLeadUpdate = (updatedLead: Lead) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    };

    socket.on('lead:created', handleNewLead);
    socket.on('lead:updated', handleLeadUpdate);

    return () => {
      socket.off('lead:created', handleNewLead);
      socket.off('lead:updated', handleLeadUpdate);
    };
  }, [socket, queryClient, toast]);

  // Fetch sales reps for filter
  const { data: salesReps } = useQuery({
    queryKey: ['salesReps'],
    queryFn: () => api.salesReps.list(),
  });

  // Update lead status mutation with Optimistic Updates
  const updateStatusMutation = useMutation({
    mutationFn: async ({ leadId, newStatus }: { leadId: string; newStatus: Lead['status'] }) => {
      return api.leads.update(leadId, { status: newStatus });
    },
    onMutate: async ({ leadId, newStatus }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['leads'] });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(['leads']);

      // Optimistically update to the new value
      queryClient.setQueryData(['leads'], (oldData: { pages: Lead[][]; pageParams: any } | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: Lead[]) => 
            page.map((lead: Lead) => 
              lead.id === leadId ? { ...lead, status: newStatus } : lead
            )
          ),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['leads'], context.previousData);
      }
      toast({
        title: "Movement failed",
        description: "Could not update lead status. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveLead(active.data.current?.lead);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveLead(null);

    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as Lead['status'];
    const lead = active.data.current?.lead as Lead;

    if (lead && lead.status !== newStatus) {
      updateStatusMutation.mutate({ leadId, newStatus });
    }
  };

  // Filter leads
  const filteredLeads = allLeads.filter((lead) => {
    const matchesSearch =
      lead.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.buyerPhone.includes(searchQuery) ||
      lead.requirements.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.pdId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRep =
      repFilter === "all" || lead.assignedRepId === repFilter;
    
    return matchesSearch && matchesRep;
  });

  // Group leads by status
  const leadsByStatus = {
    NEW: filteredLeads.filter(l => l.status === 'NEW'),
    QUALIFIED: filteredLeads.filter(l => l.status === 'QUALIFIED'),
    VISIT: filteredLeads.filter(l => l.status === 'VISIT'),
    CLOSED: filteredLeads.filter(l => l.status === 'CLOSED'),
  };

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetails(true);
  };

  const handleDrop = (leadId: string, newStatus: Lead['status']) => {
    updateStatusMutation.mutate({ leadId, newStatus });
  };

  return (
    <DashboardLayout title="Leads">
      <div className="space-y-6 animate-fade-in">
        {/* Header & Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Sales Rep Filter */}
            <Select value={repFilter} onValueChange={setRepFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Reps" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reps</SelectItem>
                {salesReps?.map((rep) => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowCreateLead(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
            
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("kanban")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading leads...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive font-semibold">Failed to load leads</p>
              <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
            </div>
          </div>
        )}

        {/* Kanban View */}
        {!isLoading && !error && viewMode === "kanban" && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
              <KanbanColumn
                title="New Leads"
                status="NEW"
                leads={leadsByStatus.NEW}
                color="bg-blue-500"
                onLeadClick={handleLeadClick}
              />
              <KanbanColumn
                title="Qualified"
                status="QUALIFIED"
                leads={leadsByStatus.QUALIFIED}
                color="bg-purple-500"
                onLeadClick={handleLeadClick}
              />
              <KanbanColumn
                title="Visit Scheduled"
                status="VISIT"
                leads={leadsByStatus.VISIT}
                color="bg-orange-500"
                onLeadClick={handleLeadClick}
              />
              <KanbanColumn
                title="Closed"
                status="CLOSED"
                leads={leadsByStatus.CLOSED}
                color="bg-green-500"
                onLeadClick={handleLeadClick}
              />
            </div>

            <DragOverlay>
              {activeLead ? (
                <div className="w-[300px] pointer-events-none rotate-3">
                  <LeadCard lead={activeLead} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {/* List View */}
        {!isLoading && !error && viewMode === "list" && (
          <div className="space-y-3">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No leads found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div key={lead.id} onClick={() => handleLeadClick(lead)}>
                  {/* You can reuse LeadCard here or create a list item component */}
                  <div className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{lead.buyerName}</h4>
                        <p className="text-sm text-muted-foreground">{lead.requirements}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          ₹{(lead.budget / 100000).toFixed(1)}L
                        </p>
                        <p className="text-xs text-muted-foreground">{lead.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading more leads...
                </div>
              )}
              {!hasNextPage && allLeads.length > 0 && (
                <p className="text-muted-foreground text-sm font-medium opacity-50">
                  You've reached the end of the list.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <LeadDetailsModal
        lead={selectedLead}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
      <CreateLeadModal
        open={showCreateLead}
        onOpenChange={setShowCreateLead}
      />
    </DashboardLayout>
  );
}
