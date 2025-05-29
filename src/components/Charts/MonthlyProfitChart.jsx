"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
  profit: {
    label: "Sale ₹",
    color: "hsl(var(--chart-1))",
  }
}

// Custom tooltip component to show ₹ symbol
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-sm text-sm">
        <p>{payload[0].payload.month}: ₹{payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function MonthlyProfitChart() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('token')
        const res = await axios.get("https://api.jewelsamarth.in/api/order/all", {
          headers: { 'x-auth-token': token }
        })
        
        const orders = Array.isArray(res.data.order) ? res.data.order : []
        setChartData(processProfitData(orders))
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Failed to load profit data")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const getLastNMonths = (n = 6) => {
    const months = []
    const date = new Date()
    
    // Start from the current month
    date.setMonth(date.getMonth() + 1) // Start from next month initially
    
    for (let i = 0; i < n; i++) {
      date.setMonth(date.getMonth() - 1) // Move back one month
      const monthName = date.toLocaleString('default', { month: 'long' })
      const year = date.getFullYear()
      months.unshift({
        name: monthName,
        year: year,
        key: `${monthName}-${year}`
      })
    }
    
    return months
  }

  const processProfitData = (orders) => {
    const last6Months = getLastNMonths(6)
    const monthlyProfit = {}

    // Initialize all months with 0 profit
    last6Months.forEach(({ name, year }) => {
      monthlyProfit[`${name}-${year}`] = 0
    })

    // Calculate profit for each order
    orders.forEach(order => {
      if (order.createdAt && order.finalAmt) {
        const date = new Date(order.createdAt)
        const monthName = date.toLocaleString('default', { month: 'long' })
        const year = date.getFullYear()
        const monthKey = `${monthName}-${year}`
        
        if (monthlyProfit.hasOwnProperty(monthKey)) {
          monthlyProfit[monthKey] += order.finalAmt
        }
      }
    })

    return last6Months.map(({ name, year, key }) => ({
      month: name,
      year: year,
      profit: Math.round(monthlyProfit[key]),
      formattedProfit: `₹${Math.round(monthlyProfit[key]).toLocaleString()}`
    }))
  }

  const calculateTrend = () => {
    if (chartData.length < 2) return 0
    const current = chartData[chartData.length - 1].profit
    const previous = chartData[chartData.length - 2].profit
    if (previous === 0) return current === 0 ? 0 : 100
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const trendPercentage = calculateTrend()
  const currentYear = new Date().getFullYear()
  const rangeString = chartData.length > 0 
    ? `${chartData[0].month} ${chartData[0].year} - ${chartData[chartData.length - 1].month} ${chartData[chartData.length - 1].year}`
    : `${currentYear}`

  if (loading) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
          <CardDescription>Loading sale data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div>Calculating sale information...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
          <CardDescription>Error loading data</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-red-500">
          {error}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Monthly Sales</CardTitle>
        <CardDescription>{rangeString}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
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
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<CustomTooltip />}
            />
            <Bar 
              dataKey="profit" 
              fill="var(--color-profit)" 
              radius={8} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trendPercentage > 0 ? 'Trending up' : trendPercentage < 0 ? 'Trending down' : 'No trend'} 
          {trendPercentage !== 0 && (
            <>
              by ₹{Math.abs(trendPercentage)}% this month{" "}
              {trendPercentage > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingUp className="h-4 w-4 rotate-180" />
              )}
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total profit for the last {chartData.length} months
        </div>
      </CardFooter>
    </Card>
  )
}