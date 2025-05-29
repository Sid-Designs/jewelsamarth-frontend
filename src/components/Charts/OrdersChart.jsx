"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-1))",
  }
}

export default function OrdersChart() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Function to get past 6 months names
  const getPastSixMonths = () => {
    const months = []
    const date = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const tempDate = new Date(date.getFullYear(), date.getMonth() - i, 1)
      months.push(tempDate.toLocaleString('default', { month: 'long' }))
    }
    
    return months
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("token")
        const res = await axios.get("https://api.jewelsamarth.in/api/order/all", {
          headers: { "x-auth-token": token },
        })

        if (!res.data?.order || !Array.isArray(res.data.order)) {
          throw new Error("Invalid data format received from API")
        }

        const processedData = processOrderData(res.data.order)
        setChartData(processedData)
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError(err.message || "Failed to load order data")
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const processOrderData = (orders) => {
    if (!orders || orders.length === 0) return []

    const monthNames = getPastSixMonths()
    const monthCounts = {}

    // Initialize all months with 0 counts
    monthNames.forEach(month => {
      monthCounts[month] = 0
    })

    // Count orders per month
    orders.forEach(order => {
      if (order.createdAt) {
        try {
          const date = new Date(order.createdAt)
          const monthName = date.toLocaleString('default', { month: 'long' })
          const year = date.getFullYear()
          const currentYear = new Date().getFullYear()
          
          // Only count if it's from current year and in our month list
          if (year === currentYear && monthCounts.hasOwnProperty(monthName)) {
            monthCounts[monthName]++
          }
        } catch (e) {
          console.error("Error processing order date:", order.createdAt, e)
        }
      }
    })

    // Convert to array format for Recharts
    return monthNames.map(month => ({
      month,
      orders: monthCounts[month]
    }))
  }

  // Calculate percentage change for the footer
  const calculateTrend = () => {
    if (chartData.length < 2) return 0
    const current = chartData[chartData.length - 1].orders
    const previous = chartData[chartData.length - 2].orders
    if (previous === 0) return current === 0 ? 0 : 100
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const trendPercentage = calculateTrend()

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Order Trends</CardTitle>
        <CardDescription>
          Showing total orders for the past 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            Loading order data...
          </div>
        ) : error ? (
          <div className="h-[300px] flex items-center justify-center text-red-500">
            {error}
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            No orders data available
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="orders"
                type="natural"
                fill="var(--color-orders)"
                fillOpacity={0.4}
                stroke="var(--color-orders)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {trendPercentage > 0 ? 'Trending up' : 'Trending down'} by {Math.abs(trendPercentage)}% this month{" "}
              {trendPercentage > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingUp className="h-4 w-4 rotate-180" />
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {chartData.length > 0 
                ? `${chartData[0].month} - ${chartData[chartData.length - 1].month} ${new Date().getFullYear()}`
                : 'No date range available'}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}