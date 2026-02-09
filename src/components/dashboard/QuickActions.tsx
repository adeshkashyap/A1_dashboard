import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, MessageCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionsProps {
  onAddClient?: () => void;
}

export function QuickActions({ onAddClient }: QuickActionsProps) {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Property",
      description: "List a new property",
      icon: Building2,
      color: "bg-chart-1 hover:bg-chart-1/90",
      onClick: () => navigate("/properties?action=add"),
    },
    {
      title: "Add Client",
      description: "Register new lead",
      icon: Users,
      color: "bg-chart-2 hover:bg-chart-2/90",
      onClick: onAddClient || (() => navigate("/clients?action=add")),
    },
    {
      title: "Send WhatsApp",
      description: "Share property details",
      icon: MessageCircle,
      color: "bg-whatsapp hover:bg-whatsapp/90",
      onClick: () => navigate("/whatsapp"),
    },
    {
      title: "Schedule Visit",
      description: "Book site inspection",
      icon: Calendar,
      color: "bg-chart-4 hover:bg-chart-4/90",
      onClick: () => navigate("/clients"),
    },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="ghost"
              className="h-auto flex-col items-start gap-2 p-4 bg-secondary/50 hover:bg-secondary"
              onClick={action.onClick}
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  {action.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}