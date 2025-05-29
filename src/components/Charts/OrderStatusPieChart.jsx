"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import axios from "axios";

const statusColors = {
  pending: "hsl(var(--chart-1))",
  processing: "hsl(var(--chart-2))",
  shipped: "hsl(var(--chart-3))",
  delivered: "hsl(var(--chart-4))",
  cancelled: "hsl(var(--chart-5))",
};

export default function OrderStatusPieChart() {
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get("https://api.jewelsamarth.in/api/order/all", {
          headers: { 'x-auth-token': token }
        });

        if (!res.data?.order || !Array.isArray(res.data.order)) {
          throw new Error("Invalid order data format");
        }

        const statusCounts = calculateStatusCounts(res.data.order);
        setChartData(formatChartData(statusCounts));
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load order data");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const calculateStatusCounts = (orders) => {
    const counts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach(order => {
      const status = order.status?.toLowerCase() || 'pending';
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });

    return counts;
  };

  const formatChartData = (statusCounts) => {
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      fill: statusColors[status] || "hsl(var(--muted))"
    })).filter(item => item.count > 0);
  };

  const totalOrders = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  const chartConfig = React.useMemo(() => {
    const config = {};
    chartData.forEach(item => {
      config[item.status] = {
        label: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        color: item.fill
      };
    });
    return config;
  }, [chartData]);

  if (loading) {
    return (
      <Card className="flex flex-col border-none shadow-none">
        <CardHeader className="items-center pb-0">
          <CardTitle>Order Status</CardTitle>
          <CardDescription>Loading order data...</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="h-[250px] flex items-center justify-center">
            Calculating order status...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col border-none shadow-none">
        <CardHeader className="items-center pb-0 border-nonr">
          <CardTitle>Order Status</CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="h-[250px] flex items-center justify-center text-red-500">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col border-none shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Order Status Distribution</CardTitle>
        <CardDescription>Current order status overview</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalOrders.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Orders
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Real-time order status <TrendingUp className="h-4 w-4" />
        </div>
        {/* <div className="leading-none text-muted-foreground">
          Showing current distribution of order statuses
        </div> */}
      </CardFooter>
    </Card>
  );
}