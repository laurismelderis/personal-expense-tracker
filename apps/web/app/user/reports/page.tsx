'use client'

import { useState, useEffect, useContext } from 'react'
import {
  DollarSign,
  Plus,
  TrendingDown,
  Eye,
  Share2,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import {
  AuthContext,
  AuthContextType,
  fetchRemoveReport,
  fetchReports,
  Report,
} from '@repo/core'
import { useToast } from '../../../hooks/useToast'
import { Button } from '../../../components/common/Button'
import { ROUTES } from '../../../constants/routes'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/common/Card'
import { Badge } from '../../../components/common/Badge'

export default function ReportsPage() {
  const { user, loading } = useContext(AuthContext) as AuthContextType
  const { toast } = useToast()
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setIsLoading(true)
      fetchReports({ userId: user.id })
        .then((data) => {
          setReports(data || [])
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: (error as Error).message,
            variant: 'destructive',
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [user])

  const deleteReport = async (reportId: string) => {
    if (!user) return
    try {
      await fetchRemoveReport({ userId: user.id, reportId })

      setReports(reports.filter((report) => report.id !== reportId))
      toast({
        title: 'Success',
        description: 'Report deleted successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete report',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center px-4">
          <div className="flex items-center gap-2 flex-1">
            <a href="/" className="flex items-center gap-2 hover:opacity-80">
              <DollarSign className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">ExpenseTracker</h1>
            </a>
          </div>

          <a href={ROUTES.DASHBOARD}>
            <Button variant="ghost" size="sm">
              Back to Dashboard
            </Button>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
            <p className="text-muted-foreground">
              Manage your expense reports and share them with others
            </p>
          </div>
          <a href={ROUTES.REPORTS_CREATE}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </a>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : reports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <TrendingDown className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first report to start tracking and sharing your
                expenses
              </p>
              <a href={ROUTES.REPORTS_CREATE}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Report
                </Button>
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{report.title}</CardTitle>
                      {report.description && (
                        <CardDescription className="mt-2">
                          {report.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {report.is_shared && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Share2 className="h-3 w-3" />
                          Shared ({report.view_count} views)
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="text-lg font-semibold">
                        ${report.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expenses</p>
                      <p className="text-lg font-semibold">
                        {report.expense_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Period</p>
                      <p className="text-sm">
                        {report.start_date && report.end_date ? (
                          <>
                            {format(new Date(report.start_date), 'MMM dd')} -{' '}
                            {format(new Date(report.end_date), 'MMM dd, yyyy')}
                          </>
                        ) : (
                          'All time'
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="text-sm">
                        {format(new Date(report.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  {report.category_filter &&
                    report.category_filter.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Categories
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {report.category_filter.map((category) => (
                            <Badge
                              key={category}
                              variant="outline"
                              className="text-xs"
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <a href={`${ROUTES.REPORTS}/${report.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReport(report.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
