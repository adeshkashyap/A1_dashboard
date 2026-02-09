import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { WhatsAppStatus } from "@/lib/api-client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { QrModal } from "@/components/QrModal";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  RefreshCcw, 
  QrCode, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  LogOut,
  Building2,
  Activity,
  BarChart2,
  List
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useToast } from "@/hooks/use-toast";

export default function WhatsApp() {
  const queryClient = useQueryClient();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: status, isLoading: isStatusLoading } = useQuery({
    queryKey: ['whatsapp', 'status'],
    queryFn: () => api.whatsapp.status(),
    refetchInterval: (query) => {
      const data = query.state.data as WhatsAppStatus;
      if (data?.connecting) return 2000;
      if (isQrModalOpen && !data?.connected) return 3000;
      return 10000;
    }
  });

  const { data: metrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['whatsapp', 'metrics'],
    queryFn: () => api.whatsapp.getMetrics(),
    refetchInterval: 15000 // Poll every 15s
  });

  // Auto-close modal when connected or syncing
  useEffect(() => {
    // Only auto-close if we are sure a device was detected (SYNCING or CONNECTED)
    // INITIALIZING state is filtered out to prevent premature closing
    const isActuallySyncing = status?.status === 'SYNCING';
    const isFullyConnected = status?.connected === true;

    if ((isFullyConnected || isActuallySyncing) && isQrModalOpen) {
      setIsQrModalOpen(false);
      toast({
        title: isFullyConnected ? "WhatsApp Connected" : "WhatsApp Syncing",
        description: isFullyConnected 
          ? "Your WhatsApp is now successfully connected." 
          : "Device detected! Syncing your messages...",
      });
    }
  }, [status?.connected, status?.status, isQrModalOpen, toast]);

  const restartMutation = useMutation({
    mutationFn: () => api.whatsapp.restart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp', 'status'] });
      toast({
        title: "WhatsApp Service Restarted",
        description: "The WhatsApp service has been restarted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Restart Failed",
        description: "Failed to restart WhatsApp service. Please try again.",
        variant: "destructive",
      });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: () => api.whatsapp.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp', 'status'] });
      toast({
        title: "WhatsApp Logged Out",
        description: "WhatsApp session has been cleared. Please scan QR code to reconnect.",
      });
    },
    onError: () => {
      toast({
        title: "Logout Failed",
        description: "Failed to logout WhatsApp. Please try again.",
        variant: "destructive",
      });
    }
  });

  return (
    <DashboardLayout title="WhatsApp Automation">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            WhatsApp Automation
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage your WhatsApp lead generation system. Connect your agency's WhatsApp number to automate lead capture and client communication.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection Status Card */}
          <Card className={status?.connected ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Connection Status
                  {status?.connected ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </CardTitle>
              </div>
              <CardDescription>
                {status?.connected 
                  ? "Your WhatsApp automation is active and capturing leads." 
                  : "Your WhatsApp automation is disconnected. Please scan the QR code to reconnect."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-muted-foreground">Status</span>
                  <span className={
                    status?.connected ? "text-green-600 font-semibold" : 
                    status?.status === 'SYNCING' ? "text-blue-500 font-semibold animate-pulse" : 
                    status?.status === 'INITIALIZING' ? "text-amber-500 font-semibold animate-pulse" :
                    "text-red-500 font-semibold"
                  }>
                    {status?.connected ? "Connected ✓" : 
                     status?.status === 'SYNCING' ? "Syncing messages..." : 
                     status?.status === 'INITIALIZING' ? "Initializing service..." :
                     "Disconnected ✗"}
                  </span>
                </div>
                
                {status?.status === 'INITIALIZING' && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
                    <p className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Initializing the service. This may take up to 30 seconds...
                    </p>
                  </div>
                )}
                {status?.connected && status?.me && (
                  <div className="flex justify-between text-sm py-2 border-b">
                    <span className="text-muted-foreground">Connected Number</span>
                    <span className="font-semibold">+{status.me}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm py-2 border-b">
                  <span className="text-muted-foreground">Last Activity</span>
                  <span className="text-sm">{status?.lastMessageAt || "No recent activity"}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <div className="flex flex-wrap gap-3">
                  {!status?.connected ? (
                    <Button 
                      onClick={() => setIsQrModalOpen(true)}
                      className="gap-2 flex-1"
                    >
                      <QrCode className="h-4 w-4" />
                      {status?.status === 'INITIALIZING' ? 'Initializing Service...' : 'Connect WhatsApp'}
                    </Button>
                  ) : (
                    <Button 
                      variant="destructive" 
                      onClick={() => logoutMutation.mutate()}
                      disabled={logoutMutation.isPending}
                      className="gap-2 flex-1"
                    >
                      <LogOut className="h-4 w-4" />
                      {logoutMutation.isPending ? "Logging out..." : "Log Out"}
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => restartMutation.mutate()}
                    disabled={restartMutation.isPending}
                    className="gap-2 flex-1"
                  >
                    <RefreshCcw className={`h-4 w-4 ${restartMutation.isPending ? 'animate-spin' : ''}`} />
                    {restartMutation.isPending ? "Resetting..." : "Reset Connection"}
                  </Button>
                </div>
                
                <QrModal 
                  open={isQrModalOpen} 
                  onOpenChange={setIsQrModalOpen} 
                  qrData={status?.qrCode}
                />
              </div>
            </CardContent>
          </Card>

          {/* How It Works Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                How WhatsApp Automation Works
              </CardTitle>
              <CardDescription>
                Automated lead capture and client engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Lead Capture</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Clients message your WhatsApp number with property requirements
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-semibold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-sm">AI Processing</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      AI understands requirements and creates lead in your dashboard
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 font-semibold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Auto-Response</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      System sends property matches and schedules site visits automatically
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-semibold text-sm">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Team Notification</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sales reps get instant notifications for qualified leads
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                System Throughput
              </CardTitle>
              <CardDescription>Real-time message processing and instance health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                {metrics && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Active', value: metrics.instances.active, color: '#22c55e' },
                        { name: 'Inactive', value: metrics.instances.inactive, color: '#ef4444' },
                        { name: 'Waiting', value: metrics.queue.waiting, color: '#3b82f6' },
                        { name: 'Processing', value: metrics.queue.active, color: '#a855f7' },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {[1, 2, 3, 4].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#22c55e', '#ef4444', '#3b82f6', '#a855f7'][index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5 text-primary" />
                Queue Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Completed Today</span>
                <span className="text-lg font-bold text-green-600">{metrics?.queue.completed || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium">Failed Messages</span>
                <span className="text-lg font-bold text-red-500">{metrics?.queue.failed || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg text-xs">
                <span className="text-muted-foreground">Monitoring active for {metrics?.instances.total || 0} instances</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Setup Instructions */}
        {!status?.connected && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-blue-900">Setup Instructions</CardTitle>
              <CardDescription className="text-blue-700">
                Follow these steps to connect your WhatsApp Business number
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600">1.</span>
                  <span>Click the "Connect WhatsApp" button above</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600">2.</span>
                  <span>Open WhatsApp on your phone</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600">3.</span>
                  <span>Go to Settings → Linked Devices → Link a Device</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600">4.</span>
                  <span>Scan the QR code displayed in the popup</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-blue-600">5.</span>
                  <span>Wait for the connection to establish (usually takes 5-10 seconds)</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}