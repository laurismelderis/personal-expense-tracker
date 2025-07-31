'use client'

import { useState, useEffect } from 'react'
import {
  Calendar,
  DollarSign,
  TrendingDown,
  Share2,
  Clock,
  Receipt,
} from 'lucide-react'
import { format } from 'date-fns'
import { useParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/common/Card'
import { Button } from '../../../../components/common/Button'
import { Badge } from '../../../../components/common/Badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/common/Dialog'
import { ReceiptImage } from '../../../../components/ReceiptImage'
import {
  fetchExpenses,
  fetchSetSharedReportViews,
  fetchSharedReport,
} from '@repo/core'

interface SharedReportData {
  id: string
  title: string
  description?: string
  start_date?: string
  end_date?: string
  category_filter?: string[]
  total_amount: number
  expense_count: number
  created_at: string
  expires_at?: string
  view_count: number
}

interface Expense {
  id: string
  amount: number
  description: string
  date: string
  created_at: string
  receipt_url?: string | null
  expense_categories: {
    name: string
    icon: string
  }
}

export default function SharedReportPage() {
  const { id: hashId } = useParams<{ id: string }>()
  const [reportData, setReportData] = useState<SharedReportData | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (hashId) {
      handleFetchSharedReport()
    }
  }, [hashId])

  const handleFetchSharedReport = async () => {
    if (!hashId) return

    try {
      setIsLoading(true)

      // First, get the shared report data
      const reportData = await fetchSharedReport({ hashId })

      // Check if report has expired
      if (
        reportData.expires_at &&
        new Date(reportData.expires_at) < new Date()
      ) {
        throw new Error('This report has expired')
      }

      setReportData(reportData)

      // Increment view count
      await fetchSetSharedReportViews({
        newViews: reportData.view_count + 1,
        reportId: reportData.id,
      })

      const expensesData = await fetchExpenses({
        userId: reportData.user_id,
        startDate: reportData.start_date,
        endDate: reportData.end_date,
      })

      // Filter by categories if specified
      let filteredExpenses = (expensesData || []) as Expense[]
      if (reportData.category_filter && reportData.category_filter.length > 0) {
        filteredExpenses = filteredExpenses.filter((expense) => {
          const categoryName = expense.expense_categories?.name
          const isIncluded = reportData.category_filter!.includes(categoryName)
          return isIncluded
        })
      }

      setExpenses(filteredExpenses)
    } catch (error: any) {
      setError(error.message || 'Failed to load shared report')
    } finally {
      setIsLoading(false)
    }
  }

  const shareReport = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Expense Report: ${reportData?.title}`,
          text: `Check out this expense report: ${reportData?.description || ''}`,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      } catch (error) {
        console.error('Failed to copy link')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">
              {error || 'Report Not Found'}
            </CardTitle>
            <CardDescription className="text-center">
              This report may have been removed, expired, or the link is
              invalid.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center px-4">
          <div className="flex items-center gap-2 flex-1">
            <DollarSign className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Shared Expense Report</h1>
          </div>

          <Button variant="outline" size="sm" onClick={shareReport}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 space-y-6">
        {/* Report Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{reportData.title}</CardTitle>
                {reportData.description && (
                  <CardDescription className="mt-2 text-base">
                    {reportData.description}
                  </CardDescription>
                )}
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created{' '}
                  {format(new Date(reportData.created_at), 'MMM dd, yyyy')}
                </div>
                {reportData.expires_at && (
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    Expires{' '}
                    {format(new Date(reportData.expires_at), 'MMM dd, yyyy')}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Total Amount
              </CardDescription>
              <CardTitle className="text-2xl font-bold">
                ${reportData.total_amount.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                Total Expenses
              </CardDescription>
              <CardTitle className="text-2xl font-bold">
                {reportData.expense_count}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters Applied */}
        {(reportData.start_date ||
          reportData.end_date ||
          reportData.category_filter) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters Applied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reportData.start_date && (
                  <div className="text-sm">
                    <strong>From:</strong>{' '}
                    {format(new Date(reportData.start_date), 'MMM dd, yyyy')}
                  </div>
                )}
                {reportData.end_date && (
                  <div className="text-sm">
                    <strong>To:</strong>{' '}
                    {format(new Date(reportData.end_date), 'MMM dd, yyyy')}
                  </div>
                )}
                {reportData.category_filter &&
                  reportData.category_filter.length > 0 && (
                    <div className="text-sm">
                      <strong>Categories:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {reportData.category_filter.map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className="text-xs"
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No expenses found for this report</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-lg">
                        {expense.expense_categories.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {expense.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(expense.date), 'MMM dd, yyyy')}
                          {expense.receipt_url && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-1 text-muted-foreground hover:text-foreground"
                                >
                                  <Receipt className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Receipt - {expense.description}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="flex justify-center">
                                  <ReceiptImage
                                    receiptPath={expense.receipt_url}
                                    alt="Receipt"
                                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="secondary" className="font-mono">
                        ${expense.amount.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
