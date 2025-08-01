'use client'

import { useState, useEffect, useContext } from 'react'
import { DollarSign, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '../../../../lib/utils'
import {
  AuthContext,
  AuthContextType,
  fetchAddReport,
  fetchAddSharedExpenses,
  fetchExpenses,
} from '@repo/core'
import { useToast } from '../../../../hooks/useToast'
import { fetchCategories } from '@repo/core'
import { ROUTES } from '../../../../constants/routes'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/common/Card'
import { Label } from '../../../../components/common/Label'
import { Input } from '../../../../components/common/Input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/common/Popover'
import { Button } from '../../../../components/common/Button'
import { Calendar } from '../../../../components/common/Calendar'
import { Textarea } from '../../../../components/common/Textarea'
import { Checkbox } from '../../../../components/common/Checkbox'
import { useRouter } from 'next/navigation'
import { SharedExpense } from '@repo/core'

interface Category {
  id: string
  name: string
}

export default function CreateReport() {
  const { user, loading } = useContext(AuthContext) as AuthContextType
  const { toast } = useToast()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCategories()
        .then((data) => {
          setCategories(data || [])
        })
        .catch((error) => {
          toast({
            title: 'Error',
            description: (error as Error).message,
            variant: 'destructive',
          })
        })
    }
  }, [user])

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    )
  }

  const createReport = async () => {
    if (!user) return

    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a report title',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsCreating(true)

      const currentDate = new Date()

      const theStartDate = format(startDate || currentDate, 'yyyy-MM-dd')
      const theEndDate = format(endDate || currentDate, 'yyyy-MM-dd')

      const expenses = await fetchExpenses({
        userId: user.id,
        startDate: theStartDate,
        endDate: theEndDate,
      })

      // Filter by categories if selected
      let filteredExpenses = expenses || []

      if (selectedCategories.length > 0) {
        filteredExpenses = filteredExpenses.filter((expense) =>
          selectedCategories.includes(expense.expense_categories?.name)
        )
      }

      const totalAmount = filteredExpenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      )
      const expenseCount = filteredExpenses.length

      const report = await fetchAddReport({
        userId: user?.id,
        title: title.trim(),
        description: description.trim() || null,
        startDate: theStartDate,
        endDate: theEndDate,
        categoryFilter:
          selectedCategories.length > 0 ? selectedCategories : null,
        totalAmount: totalAmount,
        expenseCount: expenseCount,
        isShared: false,
        isActive: true,
      })

      if (filteredExpenses.length > 0) {
        const reportExpenses = filteredExpenses.map((expense) => ({
          report_id: report.id,
          expense_id: expense.id,
          amount: expense.amount,
          description: expense.description,
          date: expense.date,
          category_name: expense.expense_categories.name,
          category_icon: expense.expense_categories.icon,
          receipt_url: expense.receipt_url,
        }))
        await fetchAddSharedExpenses({ reportExpenses })
      }

      toast({
        title: 'Success',
        description: 'Report created successfully!',
      })

      router.push(`${ROUTES.REPORTS}/${report.id}`)
    } catch (error) {
      console.error('Error creating report:', error)
      toast({
        title: 'Error',
        description: 'Failed to create report',
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
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
            <a
              href={ROUTES.REPORTS}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <ArrowLeft className="h-4 w-4" />
            </a>
            <DollarSign className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Create Report</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Report</CardTitle>
            <CardDescription>
              Generate a comprehensive expense report based on your criteria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Monthly Expenses Report"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a description for your report..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Categories (Optional)</Label>
              <p className="text-sm text-muted-foreground">
                Select specific categories to include in the report. Leave empty
                to include all categories.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.name)}
                      onCheckedChange={() =>
                        handleCategoryToggle(category.name)
                      }
                    />
                    <Label
                      htmlFor={category.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                onClick={createReport}
                disabled={isCreating || !title.trim()}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Report'
                )}
              </Button>
              <a href={ROUTES.REPORTS}>
                <Button variant="outline">Cancel</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
