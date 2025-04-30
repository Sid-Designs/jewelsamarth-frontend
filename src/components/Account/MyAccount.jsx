import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { User, ShoppingBag, MapPin, CreditCard, LogOut, ChevronRight, Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Profile from "./Profile";
import Orders from "./Orders";
import Addresses from "./Addresses";
import Payments from "./Payments";
import '@/assets/styles/MyAccount.css';

// Component Constants
const COMPONENTS = {
  profile: <Profile />,
  orders: <Orders />,
  addresses: <Addresses />,
  payments: <Payments />,
  wishlist: <div className="min-h-[400px]"><p>Your wishlist items will appear here.</p></div>,
  logout: <div className="min-h-[400px]"><p>Logging out...</p></div>,
};

const MyAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialView = searchParams.get("view")?.toLowerCase() || "profile";
  const [activeComponent, setActiveComponent] = useState(initialView);
  const userName = localStorage.getItem("username") || "User";
  const userEmail = localStorage.getItem("email") || "user@gmail.com";

  const menuItems = [
    { label: "Profile", component: "profile", icon: User },
    { label: "Orders", component: "orders", icon: ShoppingBag },
    { label: "Addresses", component: "addresses", icon: MapPin },
    { label: "Payments", component: "payments", icon: CreditCard },
    { label: "Wishlist", component: "wishlist", icon: Heart },
    { label: "Log Out", component: "logout", icon: LogOut },
  ];

  const handleMenuClick = (component) => {
    setActiveComponent(component);
    navigate(`?view=${component}`);
  };

  const renderUserIcon = () => {
    const firstLetter = userName.charAt(0).toUpperCase();
    return (
      <div className="w-20 h-20 bg-[var(--primary-color)] rounded-full flex items-center justify-center mb-3">
        {userName !== "User" ? (
          <span className="text-white font-bold text-3xl">{firstLetter}</span>
        ) : (
          <User className="h-10 w-10 text-white" />
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Menu - Hidden on mobile, 35% width on tablet/desktop */}
        <div className="hidden md:block md:w-[35%] lg:w-[30%] xl:w-[25%]">
          <Card className="overflow-hidden w-full h-full sideCnt shadow-xl rounded-[20px]">
            <div className="bg-[var(--accent-color)] text-white p-6 text-center">
              <div className="w-full flex justify-center items-center">
                {renderUserIcon()}
              </div>
              <h2 className="text-xl font-semibold capitalize">{userName}</h2>
              <p className="text-indigo-200 text-sm lowercase">{userEmail}</p>
            </div>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                {menuItems.map((item, index) => (
                  <React.Fragment key={item.component}>
                    <button
                      className={cn(
                        "flex items-center gap-3 px-8 py-3 text-sm font-medium transition-colors hover:bg-muted/50 w-full",
                        activeComponent === item.component ? "selected-tab" : ""
                      )}
                      onClick={() => handleMenuClick(item.component)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      <ChevronRight className={cn("ml-auto h-4 w-4 opacity-0 transition-opacity", activeComponent === item.component && "opacity-100", "hover:opacity-100")} />
                    </button>

                    {index < menuItems.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content Area - Full width on mobile, 65% on tablet/desktop */}
        <div className="w-full md:w-[65%] lg:w-[70%] xl:w-[75%]">
          <Card className="border-none shadow-none">
            <CardContent>{COMPONENTS[activeComponent] || <Profile />}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;