import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, TrendingUp, Building2, Users, IndianRupee, Trophy } from "lucide-react";

const monthlyData = [
  { month: "Jan", deals: 12, revenue: 2.4, leads: 45 },
  { month: "Feb", deals: 15, revenue: 3.1, leads: 52 },
  { month: "Mar", deals: 18, revenue: 3.8, leads: 68 },
  { month: "Apr", deals: 14, revenue: 2.9, leads: 55 },
  { month: "May", deals: 21, revenue: 4.5, leads: 78 },
  { month: "Jun", deals: 25, revenue: 5.2, leads: 92 },
];

const propertyTypeData = [
  { name: "Apartments", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Villas", value: 20, color: "hsl(var(--chart-2))" },
  { name: "Plots", value: 18, color: "hsl(var(--chart-3))" },
  { name: "Commercial", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Others", value: 5, color: "hsl(var(--chart-5))" },
];

const leadSourceData = [
  { source: "Website", count: 156, percentage: 35 },
  { source: "Referrals", count: 98, percentage: 22 },
  { source: "MagicBricks", count: 78, percentage: 18 },
  { source: "99acres", count: 56, percentage: 13 },
  { source: "Walk-ins", count: 34, percentage: 8 },
  { source: "Others", count: 18, percentage: 4 },
];

const topAgents = [
  { name: "Priya Sharma", deals: 18, revenue: "₹4.2Cr", avatar: "PS" },
  { name: "Amit Patel", deals: 15, revenue: "₹3.5Cr", avatar: "AP" },
  { name: "Rajesh Kumar", deals: 12, revenue: "₹2.8Cr", avatar: "RK" },
  { name: "Sneha Reddy", deals: 10, revenue: "₹2.1Cr", avatar: "SR" },
  { name: "Vikram Singh", deals: 8, revenue: "₹1.8Cr", avatar: "VS" },
];

export default function Reports() {
  return (
    <DashboardLayout title="Reports & Analytics">
      <div className="space-y-6 animate-fade-in">
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select defaultValue="6months">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Deals</p>
                  <p className="text-2xl font-bold text-foreground">105</p>
                  <p className="text-xs text-status-available mt-1">+18% vs last period</p>
                </div>
                <div className="p-3 rounded-xl bg-chart-1/10">
                  <TrendingUp className="h-5 w-5 text-chart-1" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">₹21.9Cr</p>
                  <p className="text-xs text-status-available mt-1">+24% vs last period</p>
                </div>
                <div className="p-3 rounded-xl bg-chart-2/10">
                  <IndianRupee className="h-5 w-5 text-chart-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Properties Listed</p>
                  <p className="text-2xl font-bold text-foreground">248</p>
                  <p className="text-xs text-status-available mt-1">+12% vs last period</p>
                </div>
                <div className="p-3 rounded-xl bg-chart-3/10">
                  <Building2 className="h-5 w-5 text-chart-3" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New Leads</p>
                  <p className="text-2xl font-bold text-foreground">390</p>
                  <p className="text-xs text-status-available mt-1">+32% vs last period</p>
                </div>
                <div className="p-3 rounded-xl bg-chart-4/10">
                  <Users className="h-5 w-5 text-chart-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue & Deals Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Revenue & Deals Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-1))" }}
                    name="Revenue (Cr)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="deals"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-2))" }}
                    name="Deals"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Property Type Distribution */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Property Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value} properties`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Lead Sources */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Lead Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {leadSourceData.map((source) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground font-medium">{source.source}</span>
                    <span className="text-muted-foreground">
                      {source.count} leads ({source.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Agents */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-chart-3" />
                Top Performing Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAgents.map((agent, index) => (
                  <div
                    key={agent.name}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {agent.deals} deals • {agent.revenue}
                      </p>
                    </div>
                    {index === 0 && (
                      <Badge className="bg-chart-3 text-white">Top Performer</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}