import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, MessageCircle, Phone, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "property" | "client" | "message" | "call" | "visit";
  title: string;
  description: string;
  time: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "property",
    title: "New property listed",
    description: "3 BHK Apartment in Bandra West",
    time: "10 minutes ago",
  },
  {
    id: "2",
    type: "client",
    title: "New lead added",
    description: "Rahul Sharma - Budget ₹80L-1Cr",
    time: "25 minutes ago",
  },
  {
    id: "3",
    type: "message",
    title: "WhatsApp sent",
    description: "Property details sent to Priya Patel",
    time: "1 hour ago",
  },
  {
    id: "4",
    type: "visit",
    title: "Site visit scheduled",
    description: "Villa tour with Amit Kumar tomorrow",
    time: "2 hours ago",
  },
  {
    id: "5",
    type: "call",
    title: "Call completed",
    description: "Follow-up with Sneha Reddy",
    time: "3 hours ago",
  },
];

const getActivityIcon = (type: Activity["type"]) => {
  const iconClass = "h-4 w-4";
  switch (type) {
    case "property":
      return <Building2 className={iconClass} />;
    case "client":
      return <Users className={iconClass} />;
    case "message":
      return <MessageCircle className={iconClass} />;
    case "call":
      return <Phone className={iconClass} />;
    case "visit":
      return <Calendar className={iconClass} />;
  }
};

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "property":
      return "bg-chart-1/10 text-chart-1";
    case "client":
      return "bg-chart-2/10 text-chart-2";
    case "message":
      return "bg-whatsapp/10 text-whatsapp";
    case "call":
      return "bg-chart-3/10 text-chart-3";
    case "visit":
      return "bg-chart-4/10 text-chart-4";
  }
};

export function RecentActivity() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                getActivityColor(activity.type)
              )}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-foreground">
                {activity.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}