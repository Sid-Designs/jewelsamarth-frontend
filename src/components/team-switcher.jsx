import * as React from "react";
import { useState } from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from '/JewelSamarth_Single_Logo.png';

export function TeamSwitcher({ teams }) {
  const { state, toggleSidebar } = useSidebar();
  const [activeTeam, setActiveTeam] = useState(teams[0]);

  const handleSidebarToggle = () => {
    toggleSidebar();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="sidebarHeaderPar">
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground sideHeader"
          onClick={handleSidebarToggle}
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <img src={logo} alt="Logo" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Jewel Samarth</span>
            <span className="truncate text-xs">Admin Pannel</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
