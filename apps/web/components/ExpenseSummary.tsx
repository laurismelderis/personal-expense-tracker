'use client'

import { useState, useEffect, useContext } from 'react'
import { TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react'
import {
  AuthContext,
  AuthContextType,
  ExpensesSummary,
  fetchExpensesSummary,
} from '@repo/core'
import { useToast } from '../hooks/useToast'
import { Card, CardDescription, CardHeader, CardTitle } from './common/Card'

interface ExpenseSummaryProps {
  refreshTrigger: number
}

export function ExpenseSummary({ refreshTrigger }: ExpenseSummaryProps) {
  const { user } = useContext(AuthContext) as AuthContextType
  const { toast } = useToast()
  const [summary, setSummary] = useState<ExpensesSummary>({
    todayTotal: 0,
    weekTotal: 0,
    monthTotal: 0,
    thisMonthExpensesCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setIsLoading(true)
      fetchExpensesSummary({ userId: user.id })
        .then((resp) => {
          setSummary(resp)
        })
        .catch((e) => {
          toast({
            title: 'Error',
            description: (e as Error).message,
            variant: 'destructive',
          })
        })
        .finally(() => setIsLoading(false))
    }
  }, [user, refreshTrigger])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-6 bg-muted rounded animate-pulse" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Today
          </CardDescription>
          <CardTitle className="text-2xl font-bold">
            ${summary.todayTotal.toFixed(2)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            This Week
          </CardDescription>
          <CardTitle className="text-2xl font-bold">
            ${summary.weekTotal.toFixed(2)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            This Month
          </CardDescription>
          <CardTitle className="text-2xl font-bold">
            ${summary.monthTotal.toFixed(2)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1">
            <Target className="h-3 w-3" />
            This month expenses
          </CardDescription>
          <CardTitle className="text-2xl font-bold">
            {summary.thisMonthExpensesCount}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
