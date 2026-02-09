import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Phone,
  Mail,
  MessageCircle,
  MoreVertical,
  User,
  IndianRupee,
  MapPin,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type LeadStatus = "new" | "contacted" | "interested" | "negotiating" | "closed_won" | "closed_lost";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  budgetMin: number;
  budgetMax: number;
  preferredLocations: string[];
  lastContact: string;
  source: string;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 98765 43210",
    status: "interested",
    budgetMin: 8000000,
    budgetMax: 12000000,
    preferredLocations: ["Bandra", "Juhu"],
    lastContact: "2 hours ago",
    source: "Website",
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91 87654 32109",
    status: "new",
    budgetMin: 15000000,
    budgetMax: 20000000,
    preferredLocations: ["Worli", "Lower Parel"],
    lastContact: "Just now",
    source: "Referral",
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "amit.kumar@email.com",
    phone: "+91 76543 21098",
    status: "negotiating",
    budgetMin: 40000000,
    budgetMax: 50000000,
    preferredLocations: ["Juhu"],
    lastContact: "1 day ago",
    source: "MagicBricks",
  },
  {
    id: "4",
    name: "Sneha Reddy",
    email: "sneha.reddy@email.com",
    phone: "+91 65432 10987",
    status: "contacted",
    budgetMin: 5000000,
    budgetMax: 7000000,
    preferredLocations: ["Andheri", "Powai"],
    lastContact: "3 hours ago",
    source: "99acres",
  },
  {
    id: "5",
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    phone: "+91 54321 09876",
    status: "closed_won",
    budgetMin: 12000000,
    budgetMax: 15000000,
    preferredLocations: ["BKC"],
    lastContact: "1 week ago",
    source: "Website",
  },
  {
    id: "6",
    name: "Neha Gupta",
    email: "neha.gupta@email.com",
    phone: "+91 43210 98765",
    status: "closed_lost",
    budgetMin: 3000000,
    budgetMax: 5000000,
    preferredLocations: ["Thane"],
    lastContact: "2 weeks ago",
    source: "Walk-in",
  },
];

const statusConfig: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: "New", color: "bg-lead-new text-white" },
  contacted: { label: "Contacted", color: "bg-lead-contacted text-white" },
  interested: { label: "Interested", color: "bg-lead-interested text-white" },
  negotiating: { label: "Negotiating", color: "bg-lead-negotiating text-white" },
  closed_won: { label: "Won", color: "bg-lead-closed text-white" },
  closed_lost: { label: "Lost", color: "bg-lead-lost text-white" },
};

const formatBudget = (min: number, max: number) => {
  const formatValue = (val: number) => {
    if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `${(val / 100000).toFixed(0)}L`;
    return val.toLocaleString();
  };
  return `₹${formatValue(min)} - ₹${formatValue(max)}`;
};

const kanbanColumns: { status: LeadStatus; title: string }[] = [
  { status: "new", title: "New Leads" },
  { status: "contacted", title: "Contacted" },
  { status: "interested", title: "Interested" },
  { status: "negotiating", title: "Negotiating" },
  { status: "closed_won", title: "Closed" },
];

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery)
  );

  const getClientsByStatus = (status: LeadStatus) =>
    filteredClients.filter((c) => c.status === status);

  return (
    <DashboardLayout title="Clients & Leads">
      <div className="space-y-6 animate-fade-in">
        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("kanban")}
            >
              Kanban
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("list")}
            >
              List
            </Button>
          </div>
        </div>

        {/* Kanban View */}
        {view === "kanban" && (
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {kanbanColumns.map((column) => {
              const clients = getClientsByStatus(column.status);
              return (
                <div
                  key={column.status}
                  className="flex-shrink-0 w-72 bg-muted/30 rounded-xl p-3"
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-semibold text-foreground">
                      {column.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {clients.length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {clients.map((client) => (
                      <Card
                        key={client.id}
                        className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {client.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-foreground text-sm">
                                  {client.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {client.source}
                                </p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Phone className="mr-2 h-4 w-4" />
                                  Call
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <MessageCircle className="mr-2 h-4 w-4" />
                                  WhatsApp
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Email
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <IndianRupee className="h-3 w-3" />
                              <span>{formatBudget(client.budgetMin, client.budgetMax)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">
                                {client.preferredLocations.join(", ")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{client.lastContact}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3 pt-3 border-t">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="flex-1 h-8 text-xs"
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 h-8 text-xs bg-whatsapp hover:bg-whatsapp/90"
                            >
                              <MessageCircle className="h-3 w-3 mr-1" />
                              WhatsApp
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {clients.length === 0 && (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        No clients in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <Card className="border-0 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Budget
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Preferred Areas
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Source
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">
                            {client.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div className="text-foreground">{client.phone}</div>
                          <div className="text-muted-foreground text-xs">
                            {client.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={cn("text-xs", statusConfig[client.status].color)}>
                          {statusConfig[client.status].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatBudget(client.budgetMin, client.budgetMax)}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {client.preferredLocations.join(", ")}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {client.source}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-whatsapp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Add Note</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}