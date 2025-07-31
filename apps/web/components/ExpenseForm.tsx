'use client'

import { useState, useEffect, useContext } from 'react'
import { format } from 'date-fns'
import { Plus, X, CalendarIcon, Upload, Trash2 } from 'lucide-react'
import {
  AuthContext,
  AuthContextType,
  Category,
  fetchCategories,
} from '@repo/core'
import { useToast } from '../hooks/useToast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './common/Card'
import { Button } from './common/Button'
import { Input } from './common/Input'
import { Label } from './common/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './common/Select'
import { Popover, PopoverTrigger } from './common/Popover'
import { PopoverContent } from '@radix-ui/react-popover'
import { cn } from '../lib/utils'
import { Calendar } from './common/Calendar'

interface ExpenseFormProps {
  categories: Category[]
  onExpenseAdded: () => void
  onClose?: () => void
  handleFetchCategories: () => Promise<void>
}

export function ExpenseForm({
  categories,
  onExpenseAdded,
  onClose,
  handleFetchCategories,
}: ExpenseFormProps) {
  const { user } = useContext(AuthContext) as AuthContextType
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category_id: '',
  })

  useEffect(() => {
    handleFetchCategories()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: 'Error',
          description: 'File size must be less than 5MB',
          variant: 'destructive',
        })
        return
      }

      setReceiptFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeReceipt = () => {
    setReceiptFile(null)
    setReceiptPreview(null)
  }

  // const uploadReceipt = async (file: File): Promise<string | null> => {
  //   const fileExt = file.name.split('.').pop()
  //   const fileName = `${user!.id}/${Date.now()}.${fileExt}`

  //   const { error: uploadError } = await supabase.storage
  //     .from('receipts')
  //     .upload(fileName, file)

  //   if (uploadError) {
  //     console.error('Upload error:', uploadError)
  //     return null
  //   }

  //   // Return the path for signed URL generation later
  //   return fileName
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    //   e.preventDefault()
    //   if (!user) {
    //     toast({
    //       title: 'Error',
    //       description: 'You must be logged in to add expenses',
    //       variant: 'destructive',
    //     })
    //     return
    //   }
    //   if (!formData.amount || !formData.description || !formData.category_id) {
    //     toast({
    //       title: 'Error',
    //       description: 'Please fill in all fields',
    //       variant: 'destructive',
    //     })
    //     return
    //   }
    //   setIsLoading(true)
    //   try {
    //     let receiptUrl = null
    //     // Upload receipt if provided
    //     if (receiptFile) {
    //       receiptUrl = await uploadReceipt(receiptFile)
    //       if (!receiptUrl) {
    //         toast({
    //           title: 'Error',
    //           description: 'Failed to upload receipt',
    //           variant: 'destructive',
    //         })
    //         setIsLoading(false)
    //         return
    //       }
    //     }
    //     const { error } = await supabase.from('expenses').insert({
    //       user_id: user.id,
    //       amount: parseFloat(formData.amount),
    //       description: formData.description,
    //       category_id: formData.category_id,
    //       date: format(date, 'yyyy-MM-dd'),
    //       receipt_url: receiptUrl,
    //     })
    //     if (error) {
    //       throw error
    //     }
    //     toast({
    //       title: 'Success',
    //       description: 'Expense added successfully',
    //     })
    //     // Reset form
    //     setFormData({ amount: '', description: '', category_id: '' })
    //     setDate(new Date())
    //     setReceiptFile(null)
    //     setReceiptPreview(null)
    //     onExpenseAdded()
    //     onClose?.()
    //   } catch (error) {
    //     toast({
    //       title: 'Error',
    //       description: 'Failed to add expense',
    //       variant: 'destructive',
    //     })
    //   } finally {
    //     setIsLoading(false)
    //   }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Expense
          </CardTitle>
          <CardDescription>Track your spending</CardDescription>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What did you spend on?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) =>
                setFormData({ ...formData, category_id: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) =>
                    selectedDate && setDate(selectedDate)
                  }
                  initialFocus
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Receipt (Optional)</Label>
            {!receiptPreview ? (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="receipt-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/10 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span>{' '}
                      receipt
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, JPEG (MAX. 5MB)
                    </p>
                  </div>
                  <Input
                    id="receipt-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={receiptPreview}
                  alt="Receipt preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeReceipt}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Expense'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
