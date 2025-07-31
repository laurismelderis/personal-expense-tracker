'use client'

import { useState, useEffect, useContext } from 'react'
import {
  Calendar,
  DollarSign,
  TrendingDown,
  Search,
  Filter,
  Receipt,
} from 'lucide-react'
import { format } from 'date-fns'
import {
  AuthContext,
  AuthContextType,
  Category,
  Expense,
  fetchExpenses,
} from '@repo/core'
import { useToast } from '../hooks/useToast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './common/Card'
import { Input } from './common/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './common/Select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './common/Dialog'
import { Button } from './common/Button'
import { ReceiptImage } from './ReceiptImage'
import { Badge } from './common/Badge'

interface ExpenseListProps {
  categories: Category[]
  refreshTrigger: number
  handleFetchCategories: () => Promise<void>
}

export function ExpenseList({
  categories,
  refreshTrigger,
  handleFetchCategories,
}: ExpenseListProps) {
  const { user } = useContext(AuthContext) as AuthContextType
  const { toast } = useToast()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [allExpenses, setAllExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    if (user) {
      handleFetchExpenses()
      handleFetchCategories()
    }
  }, [user, refreshTrigger])

  useEffect(() => {
    filterExpenses()
  }, [allExpenses, searchTerm, selectedCategory])

  const handleFetchExpenses = async () => {
    try {
      if (!user) return
      setIsLoading(true)
      const data = await fetchExpenses({ userId: user.id })
      setIsLoading(false)
      if (data) {
        setAllExpenses(data)
      } else {
        setAllExpenses([])
      }
    } catch (e) {
      const message = (e as Error).message
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    }
  }

  const filterExpenses = () => {
    let filtered = [...allExpenses]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((expense) =>
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(
        (expense) =>
          expense.expense_categories.name.toLowerCase() ===
          selectedCategory.toLowerCase()
      )
    }

    setExpenses(filtered)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Recent Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-20" />
                </div>
                <div className="h-6 bg-muted rounded animate-pulse w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          Recent Expenses
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Total: ${totalAmount.toFixed(2)} ({expenses.length} of{' '}
          {allExpenses.length} expenses)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No expenses yet</p>
            <p className="text-sm">Add your first expense to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
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
  )
}
