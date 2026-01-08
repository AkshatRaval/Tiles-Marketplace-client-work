import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {

  

  return (
    <SidebarProvider>
      <>
      <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </>
    </SidebarProvider>
  );
};

export default layout;
