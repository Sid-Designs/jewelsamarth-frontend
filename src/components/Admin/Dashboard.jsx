import React, { useState, useEffect } from 'react';
import MonthlyProfitChart from "@/components/Charts/MonthlyProfitChart";
import OrdersChart from "@/components/Charts/OrdersChart";
import OrderStatusPieChart from "@/components/Charts/OrderStatusPieChart";
import { Plus, Box, ShoppingCart, FileText, Users, Settings, X } from 'lucide-react';
import Orders from './Orders';
import Products from './Products';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState([
    { title: "Total Revenue", value: "₹0", change: "+0%", icon: <ShoppingCart className="text-blue-500" /> },
    { title: "New Orders", value: "0", change: "+0%", icon: <FileText className="text-green-500" /> },
    { title: "Products Sold", value: "0", change: "+0%", icon: <Box className="text-purple-500" /> },
    { title: "Unique Customers", value: "0", change: "+0%", icon: <Users className="text-orange-500" /> }
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Skeleton Loading Components
  const StatCardSkeleton = () => (
    <div className="bg-white rounded-[20px] shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="h-4 w-24 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-200 rounded mt-2 animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded mt-3 animate-pulse"></div>
        </div>
        <div className="p-2 bg-gray-100 rounded-[10px] animate-pulse">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  const ChartSkeleton = () => (
    <div className="bg-white rounded-[20px] shadow-sm p-6 border border-gray-100">
      <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
      <div className="h-64 w-full bg-gray-100 rounded animate-pulse"></div>
    </div>
  );

  const RecentActivitySkeleton = () => (
    <div className="bg-white rounded-[20px] shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-20 bg-gray-100 rounded-[20px] animate-pulse"></div>
      </div>
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-b-0">
          <div className="p-2 bg-gray-100 rounded-[10px] mr-4 animate-pulse">
            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex-1">
            <div className="h-5 w-40 bg-gray-200 rounded mb-1 animate-pulse"></div>
            <div className="h-4 w-56 bg-gray-200 rounded mb-1 animate-pulse"></div>
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  // Helper function to calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current === 0 ? "+0%" : "+100%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
  };

  // Helper function to filter orders by month and get unique customers
  const getMonthlyMetrics = (orders, targetMonth, targetYear) => {
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt || order.date || Date.now());
      return orderDate.getMonth() === targetMonth && orderDate.getFullYear() === targetYear;
    });

    const revenue = monthlyOrders.reduce((sum, order) => sum + (order.finalAmt || 0), 0);
    const ordersCount = monthlyOrders.length;
    const productsSold = monthlyOrders.reduce((sum, order) => sum + (order.products?.length || 0), 0);

    // Get unique customer IDs (assuming customerId exists in order object)
    const uniqueCustomers = new Set(
      monthlyOrders
        .filter(order => order.userId) // Filter out orders without customerId
        .map(order => order.userId)
    ).size;

    return {
      revenue,
      ordersCount,
      productsSold,
      uniqueCustomers
    };
  };

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://api.jewelsamarth.in/api/order/all", {
          headers: { "x-auth-token": token },
        });

        if (!res.data?.order || !Array.isArray(res.data.order)) {
          throw new Error("Invalid data format received from API");
        }

        const orders = res.data.order;

        // Get 4 most recent orders
        const sortedOrders = [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        setRecentOrders(sortedOrders);

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Get previous month (handles year change)
        const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
        const prevMonth = prevMonthDate.getMonth();
        const prevMonthYear = prevMonthDate.getFullYear();

        // Calculate metrics for current and previous month
        const currentMetrics = getMonthlyMetrics(orders, currentMonth, currentYear);
        const prevMetrics = getMonthlyMetrics(orders, prevMonth, prevMonthYear);

        // Calculate percentage changes
        const revenueChange = calculatePercentageChange(currentMetrics.revenue, prevMetrics.revenue);
        const ordersChange = calculatePercentageChange(currentMetrics.ordersCount, prevMetrics.ordersCount);
        const productsChange = calculatePercentageChange(currentMetrics.productsSold, prevMetrics.productsSold);
        const customersChange = calculatePercentageChange(currentMetrics.uniqueCustomers, prevMetrics.uniqueCustomers);

        setStats([
          {
            title: "Total Revenue",
            value: `₹${currentMetrics.revenue.toLocaleString()}`,
            change: revenueChange,
            icon: <ShoppingCart className="text-blue-500" />
          },
          {
            title: "New Orders",
            value: currentMetrics.ordersCount.toLocaleString(),
            change: ordersChange,
            icon: <FileText className="text-green-500" />
          },
          {
            title: "Products Sold",
            value: currentMetrics.productsSold.toLocaleString(),
            change: productsChange,
            icon: <Box className="text-purple-500" />
          },
          {
            title: "Unique Customers",
            value: currentMetrics.uniqueCustomers.toLocaleString(),
            change: customersChange,
            icon: <Users className="text-orange-500" />
          }
        ]);

      } catch (err) {
        console.error("Error fetching order stats:", err);
        setError(err.message || "Failed to load order data");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStats();
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Tabs defaultValue="dashboard" className="w-full">
        {/* Header with tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-[var(--accent-color)] to-purple-600 bg-clip-text text-transparent inline-block">
              Jeved Samarth Admin Panel
            </h1>
            <p className="text-gray-500">
              {activeTab === 'dashboard' && 'Welcome back! Here\'s what\'s happening with your store.'}
              {activeTab === 'orders' && 'Manage your orders'}
              {activeTab === 'products' && 'Manage your products'}
              {activeTab === 'settings' && 'Configure your store settings'}
            </p>
          </div>

          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger
              value="dashboard"
              onClick={() => setActiveTab('dashboard')}
              className="rounded-[20px]"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              onClick={() => setActiveTab('orders')}
              className="rounded-[20px]"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="products"
              onClick={() => setActiveTab('products')}
              className="rounded-[20px]"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              onClick={() => setActiveTab('settings')}
              className="rounded-[20px]"
            >
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Content */}
        <TabsContent value="dashboard">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
              Array(4).fill(0).map((_, index) => (
                <StatCardSkeleton key={index} />
              ))
            ) : (
              stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-[20px] shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                      <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-[10px]">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 overflow-hidden h-[450px]">
            {loading ? (
              Array(3).fill(0).map((_, index) => (
                <ChartSkeleton key={index} />
              ))
            ) : (
              <>
                <div className="bg-white rounded-[20px] shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                  <div className="h-64">
                    <MonthlyProfitChart />
                  </div>
                </div>
                <div className="bg-white rounded-[20px] shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                  <div className="h-64">
                    <OrdersChart />
                  </div>
                </div>
                <div className="bg-white rounded-[20px] shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Sales Distribution</h3>
                  <div className="h-64">
                    <OrderStatusPieChart />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-[20px] shadow-sm p-6 border border-gray-100 mb-8">
            {loading ? (
              <RecentActivitySkeleton />
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Recent Orders</h3>
                  <TabsList className="grid w-full md:w-auto">
                    <TabsTrigger
                      value="orders"
                      onClick={() => setActiveTab('orders')}
                      className="rounded-[20px] mx-0 pr-0 text-[var(--accent-color)] hover:bg-gray-200"
                    >
                      View All
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <a href={`/order/${order._id}`} target='_blank' key={order._id} className="flex hover:bg-gray-100 cursor-pointer rounded-[20px] p-4 items-start border-b border-gray-100 last:border-b-0">
                      <div className="p-2 bg-blue-50 rounded-[10px] mr-4">
                        <ShoppingCart className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {order.orderNumber ? `Order #${order.orderNumber}` : `Order ${order._id.slice(-6).toUpperCase()}`}
                        </h4>
                        <p className="text-sm text-gray-500 capitalize">
                          {order.userId ? `Customer: ${order.firstName} ${order.lastName}` : 'Guest customer'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        ₹{(order.finalAmt || 0).toLocaleString('en-IN')}
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* Orders Content */}
        <TabsContent value="orders">
          <div className="bg-white rounded-[20px] shadow-sm p-6 border border-gray-100">
            <Orders />
          </div>
        </TabsContent>

        {/* Products Content */}
        <TabsContent value="products">
          <div className="bg-white rounded-[20px] shadow-sm p-6 border border-gray-100">
            <Products />
          </div>
        </TabsContent>

        {/* Settings Content */}
        <TabsContent value="settings">
          <div className="bg-white rounded-[20px] shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Settings Panel</h2>
            <p>Coupons setting comming soon....</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;