import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Zap,
  MessageCircle,
  Mail,
  Calendar,
  Clock,
  Bell,
  UserPlus,
  Building2,
  Plus,
  Settings,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  isActive: boolean;
  lastRun: string;
  runsToday: number;
  icon: React.ElementType;
  iconColor: string;
}

const mockAutomations: Automation[] = [
  {
    id: "1",
    name: "Welcome Message",
    description: "Send WhatsApp welcome message to new leads",
    trigger: "New lead added",
    action: "Send WhatsApp template",
    isActive: true,
    lastRun: "5 minutes ago",
    runsToday: 12,
    icon: UserPlus,
    iconColor: "text-chart-1",
  },
  {
    id: "2",
    name: "Follow-up Reminder",
    description: "Remind agents to follow up with interested leads",
    trigger: "Lead inactive for 3 days",
    action: "Create task & notify agent",
    isActive: true,
    lastRun: "1 hour ago",
    runsToday: 8,
    icon: Bell,
    iconColor: "text-chart-3",
  },
  {
    id: "3",
    name: "Site Visit Reminder",
    description: "Send reminder 24h before scheduled visit",
    trigger: "Visit scheduled",
    action: "Send WhatsApp & Email",
    isActive: true,
    lastRun: "30 minutes ago",
    runsToday: 5,
    icon: Calendar,
    iconColor: "text-chart-4",
  },
  {
    id: "4",
    name: "New Property Alert",
    description: "Notify matching clients when new property is listed",
    trigger: "Property added",
    action: "Send property details to matching leads",
    isActive: false,
    lastRun: "2 days ago",
    runsToday: 0,
    icon: Building2,
    iconColor: "text-chart-2",
  },
  {
    id: "5",
    name: "Daily Summary",
    description: "Send daily activity summary to managers",
    trigger: "Every day at 8 PM",
    action: "Email report to managers",
    isActive: true,
    lastRun: "Yesterday 8:00 PM",
    runsToday: 1,
    icon: Mail,
    iconColor: "text-chart-5",
  },
];

export default function Automation() {
  const [automations, setAutomations] = useState(mockAutomations);

  const toggleAutomation = (id: string) => {
    setAutomations(automations.map(a =>
      a.id === id ? { ...a, isActive: !a.isActive } : a
    ));
  };

  const activeCount = automations.filter(a => a.isActive).length;
  const totalRuns = automations.reduce((sum, a) => sum + a.runsToday, 0);

  return (
    <DashboardLayout title="Automation">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-chart-1/10">
                  <Zap className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Workflows</p>
                  <p className="text-2xl font-bold text-foreground">{activeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-chart-2/10">
                  <Play className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Runs Today</p>
                  <p className="text-2xl font-bold text-foreground">{totalRuns}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-chart-3/10">
                  <Clock className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Saved</p>
                  <p className="text-2xl font-bold text-foreground">4.5 hrs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Workflows</h2>
            <p className="text-sm text-muted-foreground">
              Automate repetitive tasks and save time
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Workflow
          </Button>
        </div>

        {/* Automations Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {automations.map((automation) => (
            <Card
              key={automation.id}
              className={cn(
                "border-0 shadow-sm transition-all",
                !automation.isActive && "opacity-60"
              )}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2.5 rounded-xl",
                      automation.isActive ? "bg-secondary" : "bg-muted"
                    )}>
                      <automation.icon className={cn("h-5 w-5", automation.iconColor)} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">
                          {automation.name}
                        </h3>
                        {automation.isActive ? (
                          <Badge className="bg-status-available text-white text-xs">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Paused
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {automation.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={automation.isActive}
                    onCheckedChange={() => toggleAutomation(automation.id)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-muted/30 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Trigger</p>
                    <p className="text-foreground">{automation.trigger}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Action</p>
                    <p className="text-foreground">{automation.action}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {automation.lastRun}
                    </span>
                    <span className="flex items-center gap-1">
                      <Play className="h-3.5 w-3.5" />
                      {automation.runsToday} today
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Settings className="h-3.5 w-3.5" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Banner */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-chart-4/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  Power up with Advanced Automations
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Connect to n8n for advanced workflow capabilities including
                  custom integrations, conditional logic, and third-party app connections.
                </p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}