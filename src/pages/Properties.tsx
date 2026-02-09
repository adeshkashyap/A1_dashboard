import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import api, { type Property } from "@/lib/api-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Maximize,
  MessageCircle,
  Edit,
  MoreVertical,
  Loader2,
  Building2,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CreatePropertyModal } from "@/components/properties/CreatePropertyModal";
import { EditPropertyModal } from "@/components/properties/EditPropertyModal";
import { DeletePropertyDialog } from "@/components/properties/DeletePropertyDialog";

type ViewMode = "grid" | "table";

const statusConfig = {
  available: {
    label: "Available",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  sold: {
    label: "Sold",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  rented: {
    label: "Rented",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  under_negotiation: {
    label: "Negotiating",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
};

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)}Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`;
  } else {
    return `₹${price.toLocaleString()}`;
  }
};

export default function Properties() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showCreateProperty, setShowCreateProperty] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch properties with infinite scroll
  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['properties'],
    queryFn: ({ pageParam = 1 }) => api.properties.list(pageParam as number, 12),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length < 12 ? undefined : allPages.length + 1;
    },
    initialPageParam: 1,
  });

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

  const allProperties = data?.pages.flat() || [];

  const filteredProperties = allProperties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (property.location && property.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || (property.available ? "available" : "sold") === statusFilter;
    const matchesType =
      typeFilter === "all" || property.category.toLowerCase() === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <DashboardLayout title="Properties">
      <div className="space-y-6 animate-fade-in">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive font-semibold">Failed to load properties</p>
              <p className="text-sm text-muted-foreground mt-2">Please try again later</p>
            </div>
          </div>
        )}

        {/* Content - Only show if not loading and no error */}
        {!isLoading && !error && (
          <>
            {/* Filters Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="2bhk">2BHK</SelectItem>
                    <SelectItem value="3bhk">3BHK</SelectItem>
                    <SelectItem value="4bhk">4BHK</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={() => setShowCreateProperty(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("table")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Properties Grid */}
        {viewMode === "grid" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={property.image || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <Badge
                    className={cn(
                      "absolute top-3 left-3",
                      property.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {property.available ? "Available" : "Sold"}
                  </Badge>
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{property.location || 'Gurgaon'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {property.bhk && property.bhk > 0 && (
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{property.bhk} BHK</span>
                        </div>
                      )}
                      {property.sqft && property.sqft > 0 && (
                        <div className="flex items-center gap-1">
                          <Maximize className="h-4 w-4" />
                          <span>{property.sqft} sqft</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(property.price)}
                      </span>
                      <Badge variant="secondary">{property.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Properties Table */}
        {viewMode === "table" && (
          <Card className="border-0 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Property
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Area
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Location
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property) => (
                    <tr
                      key={property.id}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={property.image || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'}
                            alt={property.title}
                            className="h-10 w-14 rounded object-cover"
                          />
                          <span className="font-medium text-foreground">
                            {property.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {property.category}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={cn(
                            "text-xs",
                            property.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          )}
                        >
                          {property.available ? "Available" : "Sold"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-medium text-primary">
                        {formatPrice(property.price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {property.sqft || '-'} sqft
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {property.location || 'Gurgaon'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingProperty(property)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Share via WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeletingProperty(property)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {filteredProperties.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Filter className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              No properties found
            </h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={loadMoreRef} className="py-8 flex justify-center">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more properties...
            </div>
          )}
          {!hasNextPage && allProperties.length > 0 && (
            <p className="text-muted-foreground text-sm font-medium opacity-50">
              You've reached the end of the catalog.
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreatePropertyModal open={showCreateProperty} onOpenChange={setShowCreateProperty} />
      <EditPropertyModal 
        property={editingProperty} 
        open={!!editingProperty} 
        onOpenChange={(open) => !open && setEditingProperty(null)} 
      />
      <DeletePropertyDialog
        property={deletingProperty}
        open={!!deletingProperty}
        onOpenChange={(open) => !open && setDeletingProperty(null)}
      />
    </DashboardLayout>
  );
}