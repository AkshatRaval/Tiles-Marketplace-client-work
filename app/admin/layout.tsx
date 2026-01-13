import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        {/* SidebarInset provides the correct padding/transition when sidebar toggles */}
        <SidebarInset className="flex flex-col">
          
          {/* Top Navigation Bar */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex flex-1 flex-col gap-4 p-6 overflow-y-auto">
            {children}
          </main>
          
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;