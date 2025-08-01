'use client'

import { useState, useEffect, useContext } from 'react'
import {
  DollarSign,
  Calendar,
  TrendingDown,
  Share2,
  Copy,
  ArrowLeft,
  Receipt,
  Eye,
} from 'lucide-react'
import { format } from 'date-fns'
import {
  AuthContext,
  AuthContextType,
  fetchExpenses,
  fetchReport,
  fetchShareReport,
} from '@repo/core'
import { useToast } from '../../../../hooks/useToast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/common/Card'
import { ROUTES } from '../../../../constants/routes'
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
import { useParams } from 'next/navigation'

interface ReportData {
  id: string
  title: string
  description?: string
  start_date?: string
  end_date?: string
  category_filter?: string[]
  total_amount: number
  expense_count: number
  created_at: string
  is_shared: boolean
  hash_id?: string
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

export default function ReportPage() {
  const { user, loading } = useContext(AuthContext) as AuthContextType
  const { toast } = useToast()
  const { id: reportId } = useParams<{ id: string }>()

  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSharing, setIsSharing] = useState(false)

  useEffect(() => {
    if (user && reportId) {
      handleFetchReportData()
    }
  }, [user, reportId])

  const handleFetchReportData = async () => {
    if (!reportId || !user) return

    try {
      setIsLoading(true)

      const report = await fetchReport({ userId: user.id, reportId })
      setReportData(report)

      const expensesData = await fetchExpenses({
        userId: user.id,
        startDate: report.start_date,
        endDate: report.end_date,
      })

      // Filter by categories if specified
      let filteredExpenses = expensesData || []
      if (report.category_filter && report.category_filter.length > 0) {
        filteredExpenses = filteredExpenses.filter((expense) =>
          report.category_filter!.includes(expense.expense_categories?.name)
        )
      }

      setExpenses(filteredExpenses)
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const shareReport = async () => {
    if (!reportData || !user) return

    try {
      setIsSharing(true)

      if (reportData.is_shared && reportData.hash_id) {
        // Already shared, just copy the link
        const shareUrl = `${window.location.origin}${ROUTES.SHARED_REPORTS}/${reportData.hash_id}`
        await navigator.clipboard.writeText(shareUrl)
        toast({
          title: 'Success',
          description: 'Share link copied to clipboard!',
        })
      } else {
        // Generate share hash directly
        const shareHash = await fetchShareReport({
          userId: user.id,
          reportId: reportData.id,
        })

        const shareUrl = `${window.location.origin}${ROUTES.SHARED_REPORTS}/${shareHash}`
        await navigator.clipboard.writeText(shareUrl)

        // Update local state
        setReportData((prev) =>
          prev ? { ...prev, is_shared: true, hash_id: shareHash } : null
        )

        toast({
          title: 'Success',
          description: 'Report shared! Link copied to clipboard.',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      })
    } finally {
      setIsSharing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/95 backdrop-blur">
          <div className="container flex h-14 items-center px-4">
            <div className="flex items-center gap-2 flex-1">
              <DollarSign className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Loading Report...</h1>
            </div>
          </div>
        </header>
        <main className="container px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-background/95 backdrop-blur">
          <div className="container flex h-14 items-center px-4">
            <div className="flex items-center gap-2 flex-1">
              <DollarSign className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Report Not Found</h1>
            </div>
          </div>
        </header>
        <main className="container px-4 py-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-semibold mb-2">Report Not Found</h3>
              <p className="text-muted-foreground text-center mb-4">
                The report you&apos;re looking for doesn&apos;t exist or you
                don&apos;t have permission to view it.
              </p>
              <a href={ROUTES.REPORTS}>
                <Button>Back to Reports</Button>
              </a>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center px-4">
          <div className="flex items-center gap-2 flex-1">
            <a
              href={ROUTES.REPORTS}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <ArrowLeft className="h-4 w-4" />
            </a>
            <DollarSign className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Report Details</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={shareReport}
              disabled={isSharing}
              variant={reportData.is_shared ? 'outline' : 'default'}
            >
              {isSharing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              ) : reportData.is_shared ? (
                <Copy className="h-4 w-4 mr-2" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              {reportData.is_shared ? 'Copy Link' : 'Share Report'}
            </Button>
          </div>
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
              <div className="flex items-center gap-2">
                {reportData.is_shared && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    {reportData.view_count} views
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created{' '}
                {format(new Date(reportData.created_at), 'MMM dd, yyyy')}
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
