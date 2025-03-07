"use client"

import React, { useState } from "react"
import { User, ShoppingBag, MapPin, CreditCard, LogOut, ChevronRight, Heart } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Profile from "./Profile"
import Orders from "./Orders"
import Addresses from "./Addresses"
import Payments from "./Payments"
import '@/assets/styles/MyAccount.css'

const MyAccount = () => {
  const [activeComponent, setActiveComponent] = useState("Profile")

  const renderComponent = () => {
    switch (activeComponent) {
      case "Profile":
        return <Profile />
      case "Orders":
        return <Orders />
      case "Addresses":
        return <Addresses />
      case "Payments":
        return <Payments />
      case "Wishlist":
        return (
          <div className="min-h-[400px]">
            <p>Your wishlist items will appear here.</p>
          </div>
        )
      case "Logout":
        return (
          <div className="min-h-[400px]">
            <p>Logging out...</p>
          </div>
        )
      default:
        return <Profile />
    }
  }

  const menuItems = [
    { label: "Profile", component: "Profile", icon: User },
    { label: "Orders", component: "Orders", icon: ShoppingBag },
    { label: "Addresses", component: "Addresses", icon: MapPin },
    { label: "Payments", component: "Payments", icon: CreditCard },
    { label: "Wishlist", component: "Wishlist", icon: Heart },
    { label: "Log Out", component: "Logout", icon: LogOut },
  ]

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Menu */}
        <div className="md:col-span-1 flex items-start">
          <Card className="overflow-hidden w-full sideCnt">
            <div className="bg-[var(--accent-color)] text-white p-6">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-[var(--primary-color)] rounded-full flex items-center justify-center mb-3">
                  <User className="h-10 w-10" />
                </div>
                <h2 className="text-xl font-semibold">Asdf Xyz</h2>
                <p className="text-indigo-200 text-sm">asdf@example.com</p>
              </div>
            </div>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                {menuItems.map((item, index) => (
                  <React.Fragment key={item.label}>
                    <button
                      className={cn(
                        "flex items-center gap-3 px-8 py-3 text-sm font-medium transition-colors hover:bg-muted/50 relative group w-full",
                        activeComponent === item.component
                          ? "selected-tab"
                          : ""
                      )}
                      onClick={() => setActiveComponent(item.component)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      <ChevronRight
                        className={cn(
                          "ml-auto h-4 w-4 opacity-0 transition-opacity",
                          activeComponent === item.component && "opacity-100",
                          "group-hover:opacity-100",
                        )}
                      />
                    </button>

                    {index < menuItems.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content Area */}
        <Card className="md:col-span-3 border-none shadow-none">
          <CardContent className="">{renderComponent()}</CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MyAccount

