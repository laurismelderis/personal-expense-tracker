'use client'

import { useState, useEffect, useContext } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  format,
  subDays,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from 'date-fns'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart as PieChartIcon,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './common/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import {
  AuthContext,
  AuthContextType,
  fetchExpensesThreeMonthsAgo,
} from '@repo/core'

interface SpendingData {
  date: string
  amount: number
  label: string
}

interface CategoryData {
  name: string
  amount: number
  color: string
}

interface SpendingTrendChartsProps {
  refreshTrigger: number
}

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#0088fe',
  '#00c49f',
  '#ffbb28',
  '#ff8042',
]

export function SpendingTrendCharts({
  refreshTrigger,
}: SpendingTrendChartsProps) {
  const { user } = useContext(AuthContext) as AuthContextType
  const [dailyData, setDailyData] = useState<SpendingData[]>([])
  const [weeklyData, setWeeklyData] = useState<SpendingData[]>([])
  const [monthlyData, setMonthlyData] = useState<SpendingData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSpendingData()
  }, [refreshTrigger])

  const fetchSpendingData = async () => {
    try {
      if (!user) return

      setLoading(true)

      const expenses = await fetchExpensesThreeMonthsAgo({ userId: user.id })

      // Process daily data (last 30 days)
      const thirtyDaysAgo = subDays(new Date(), 30)
      const dailyRange = eachDayOfInterval({
        start: thirtyDaysAgo,
        end: new Date(),
      })
      const dailySpending = dailyRange.map((date) => {
        const dayExpenses =
          expenses?.filter(
            (expense) =>
              format(new Date(expense.date), 'yyyy-MM-dd') ===
              format(date, 'yyyy-MM-dd')
          ) || []
        const total = dayExpenses.reduce(
          (sum, expense) => sum + Number(expense.amount),
          0
        )

        return {
          date: format(date, 'yyyy-MM-dd'),
          amount: total,
          label: format(date, 'MMM dd'),
        }
      })

      // Process weekly data (last 12 weeks)
      const twelveWeeksAgo = subDays(new Date(), 84)
      const weeklyRange = eachWeekOfInterval({
        start: twelveWeeksAgo,
        end: new Date(),
      })
      const weeklySpending = weeklyRange.map((weekStart) => {
        const weekEnd = endOfWeek(weekStart)
        const weekExpenses =
          expenses?.filter((expense) => {
            const expenseDate = new Date(expense.date)
            return expenseDate >= weekStart && expenseDate <= weekEnd
          }) || []
        const total = weekExpenses.reduce(
          (sum, expense) => sum + Number(expense.amount),
          0
        )

        return {
          date: format(weekStart, 'yyyy-MM-dd'),
          amount: total,
          label: `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd')}`,
        }
      })

      // Process monthly data (last 6 months)
      const sixMonthsAgo = subMonths(new Date(), 6)
      const monthlyRange = eachMonthOfInterval({
        start: sixMonthsAgo,
        end: new Date(),
      })
      const monthlySpending = monthlyRange.map((month) => {
        const monthStart = startOfMonth(month)
        const monthEnd = endOfMonth(month)
        const monthExpenses =
          expenses?.filter((expense) => {
            const expenseDate = new Date(expense.date)
            return expenseDate >= monthStart && expenseDate <= monthEnd
          }) || []
        const total = monthExpenses.reduce(
          (sum, expense) => sum + Number(expense.amount),
          0
        )

        return {
          date: format(month, 'yyyy-MM-dd'),
          amount: total,
          label: format(month, 'MMM yyyy'),
        }
      })

      // Process category data (last 30 days)
      const categoryTotals = new Map<string, number>()
      const recentExpenses =
        expenses?.filter(
          (expense) => new Date(expense.date) >= thirtyDaysAgo
        ) || []

      recentExpenses.forEach((expense) => {
        const categoryName = expense.expense_categories?.name || 'Other'
        const current = categoryTotals.get(categoryName) || 0
        categoryTotals.set(categoryName, current + Number(expense.amount))
      })

      const categorySpending = Array.from(categoryTotals.entries())
        .map(([name, amount], index) => ({
          name,
          amount,
          color: COLORS[index % COLORS.length],
        }))
        .sort((a, b) => b.amount - a.amount)

      setDailyData(dailySpending)
      setWeeklyData(weeklySpending)
      setMonthlyData(monthlySpending)
      setCategoryData(categorySpending)
    } catch (error) {
      console.error('Error fetching spending data:', error)
    } finally {
      setLoading(false)
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{payload[0].payload.label}</p>
          <p className="text-sm text-primary">${payload[0].value.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Spending Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Spending Trends
          </CardTitle>
          <CardDescription>
            Track your spending patterns over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="daily">Daily (30d)</TabsTrigger>
              <TabsTrigger value="weekly">Weekly (12w)</TabsTrigger>
              <TabsTrigger value="monthly">Monthly (6m)</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="label"
                      className="text-xs"
                      interval="preserveStartEnd"
                    />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="label"
                      className="text-xs"
                      interval="preserveStartEnd"
                    />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="amount"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis dataKey="label" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{
                        fill: 'hsl(var(--primary))',
                        strokeWidth: 2,
                        r: 4,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {categoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Spending by Category
            </CardTitle>
            <CardDescription>Last 30 days breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `$${value.toFixed(2)}`,
                        'Amount',
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {categoryData.map((category, index) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm font-mono">
                      ${category.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
