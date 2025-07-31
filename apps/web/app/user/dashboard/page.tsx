'use client'

import { useState, useContext } from 'react'
import { DollarSign, Plus, LogOut, Menu, FileText } from 'lucide-react'
import {
  AuthContext,
  AuthContextType,
  Category,
  fetchCategories,
} from '@repo/core'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '../../../components/common/Sheet'
import { Button } from '../../../components/common/Button'
import { CreateReportButton } from '../../../components/CreateReportButton'
import { ExpenseSummary } from '../../../components/ExpenseSummary'
import { SpendingTrendCharts } from '../../../components/SpendingTrendCharts'
import { ExpenseForm } from '../../../components/ExpenseForm'
import { ExpenseList } from '../../../components/ExpenseList'
import { useToast } from '../../../hooks/useToast'
import { ROUTES } from '../../../constants/routes'

const DashboardPage = () => {
  const { signOut, loading } = useContext(AuthContext) as AuthContextType
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const { toast } = useToast()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleExpenseAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
    setShowExpenseForm(false)
  }

  const handleFetchCategories = async () => {
    try {
      const data = await fetchCategories()
      setCategories(data || [])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      })
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <div className="flex items-center gap-2 flex-1">
            <DollarSign className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">ExpenseTracker</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="space-y-4 py-4">
                  <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold">Menu</h2>
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setShowExpenseForm(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Expense
                      </Button>
                      <CreateReportButton />
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2">
              <CreateReportButton variant="outline" />
              <a href={ROUTES.REPORTS}>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Reports
                </Button>
              </a>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s your spending overview
          </p>
        </div>

        {/* Summary Cards */}
        <ExpenseSummary refreshTrigger={refreshTrigger} />

        {/* Spending Trends Charts */}
        <SpendingTrendCharts refreshTrigger={refreshTrigger} />

        {/* Add Expense Form (Mobile) */}
        {showExpenseForm && (
          <div className="md:hidden">
            <ExpenseForm
              categories={categories}
              onExpenseAdded={handleExpenseAdded}
              handleFetchCategories={handleFetchCategories}
              onClose={() => setShowExpenseForm(false)}
            />
          </div>
        )}

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          <ExpenseForm
            categories={categories}
            onExpenseAdded={handleExpenseAdded}
            handleFetchCategories={handleFetchCategories}
          />
          <ExpenseList
            categories={categories}
            refreshTrigger={refreshTrigger}
            handleFetchCategories={handleFetchCategories}
          />
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {!showExpenseForm && (
            <>
              <ExpenseList
                categories={categories}
                refreshTrigger={refreshTrigger}
                handleFetchCategories={handleFetchCategories}
              />

              {/* Floating Add Button */}
              <div className="fixed bottom-6 right-6">
                <Button
                  size="lg"
                  className="h-14 w-14 rounded-full shadow-lg"
                  onClick={() => setShowExpenseForm(true)}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
