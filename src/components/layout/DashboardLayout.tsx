import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}

export function DashboardLayout({ children, title, actions }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="sticky top-0 z-40 flex h-14 sm:h-16 items-center justify-between gap-3 border-b bg-card px-3 sm:px-4 lg:px-6 min-w-0">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <SidebarTrigger className="lg:hidden shrink-0" />
              {title && (
                <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate min-w-0">
                  {title}
                </h1>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Search */}
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search properties, clients..."
                  className="w-48 lg:w-64 pl-9 bg-muted border-0"
                />
              </div>

              {/* Quick Add */}
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add New</span>
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  3
                </span>
              </Button>

              {actions}
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}