import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Package,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      componentName: "Dashboard", // Add this property
      items: [],
    },
    {
      title: "Orders",
      url: "#",
      icon: Bot,
      componentName: "Orders", // Add this property
      items: [],
    },
    {
      title: "Sales",
      url: "#",
      icon: PieChart,
      componentName: "Sales", // Add this property
      items: [],
    },
    {
      title: "Posts",
      url: "#",
      icon: BookOpen,
      url: "/products/67bb2fd763535ebe8ebe70d4",
      componentName: "Posts", // Add this property
      items: [],
    },
    {
      title: "Products",
      icon: Package,
      items: [
        {
          title: "All Products",
          componentName: "All Products"
        },
        {
          title: "Add New",
          componentName: "Add New"
        },
        {
          title: "Categories",
          componentName: "Categories"
        },
        {
          title: "Tags",
          componentName: "Tags"
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ onSidebarItemClick, collapsed, ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} collapsed={collapsed} /> {/* Pass collapsed state */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          onSidebarItemClick={onSidebarItemClick}
          collapsed={collapsed} // Pass the collapsed state
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} collapsed={collapsed} /> {/* Pass collapsed state */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}