import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Dashboard from "@/components/Admin/Dashboard";
import Orders from "@/components/Admin/Orders";
import Sales from "@/components/Admin/Sales";
import Posts from "@/components/Admin/Posts";
import Products from "@/components/Admin/Products"; 
import AddProduct from "@/components/Admin/AddProduct";
import ProductCategories from "@/components/Admin/ProductCategories";
import ProductTags from "@/components/Admin/ProductTags";

export default function Page() {
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return <Dashboard />;
      case "Orders":
        return <Orders />;
      case "Sales":
        return <Sales />;
      case "Posts":
        return <Posts />;
      case "All Products":
        return <Products />; 
      case "Add New":
        return <AddProduct />; 
      case "Categories":
        return <ProductCategories />; 
      case "Tags":
        return <ProductTags />; 
      default:
        return <Dashboard />;
    }
  };

  const handleSidebarItemClick = (componentName) => {
    setSelectedComponent(componentName);
  };

  return (
    <SidebarProvider>
      <AppSidebar
        onSidebarItemClick={handleSidebarItemClick}
        collapsed={collapsed}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:hidden dashHeader">
          <div className="flex items-center gap-2 px-4 mobTogglePar">
            <SidebarTrigger
              className="-ml-1"
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>
          <div className="ml-2">Admin Panel</div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-0 md:p-4 overflow-x-hidden">
          {renderComponent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}