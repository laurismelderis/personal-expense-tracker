import { format, subMonths } from 'date-fns'
import { supabase } from '../lib/supabase'
import { Category } from './categories'
import {
  getStartOfMonth,
  getStartOfWeek,
  getThreeMonthsAgo,
  getToday,
} from '../utils'

export interface Expense {
  id: string
  amount: number
  description: string
  created_at: string
  date: string
  receipt_url: string | null
  expense_categories: Category
}

export interface ExpensesSummary {
  todayTotal: number
  weekTotal: number
  monthTotal: number
  thisMonthExpensesCount: number
}

export const fetchExpenses = async ({
  userId,
}: {
  userId: string
}): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select(
      `
        id,
        amount,
        description,
        created_at,
        date,
        receipt_url,
        expense_categories (
          id,
          name,
          icon
        )
      `
    )
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(20)
    .overrideTypes<Expense[]>()

  if (data && !error) {
    return data
  } else if (error) {
    throw new Error(error.message)
  }
  throw new Error('Failed to load expenses')
}

export const fetchAddExpense = async ({
  userId,
  amount,
  description,
  categoryId,
  date,
  receiptUrl,
}: {
  userId: string
  amount: number
  description: string
  categoryId: string
  date: string
  receiptUrl?: string
}) => {
  const { error } = await supabase.from('expenses').insert({
    user_id: userId,
    amount,
    description,
    category_id: categoryId,
    date,
    receipt_url: receiptUrl,
  })

  if (error) {
    throw new Error(error.message)
  }
  return
}

const fetchTodaysExpenses = async ({ userId }: { userId: string }) => {
  const today = getToday()

  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())
    .lt(
      'created_at',
      new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
    )

  if (data && !error) {
    return data
  } else if (error) {
    throw new Error(error.message)
  }
  throw new Error('Failed to load expenses')
}

const fetchWeeksExpenses = async ({ userId }: { userId: string }) => {
  const startOfWeek = getStartOfWeek()
  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', userId)
    .gte('created_at', startOfWeek.toISOString())

  if (data && !error) {
    return data
  } else if (error) {
    throw new Error(error.message)
  }
  throw new Error('Failed to load expenses')
}

const fetchMonthsExpenses = async ({ userId }: { userId: string }) => {
  const startOfMonth = getStartOfMonth()

  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString())

  if (data && !error) {
    return data
  } else if (error) {
    throw new Error(error.message)
  }
  throw new Error('Failed to load expenses')
}

const fetchMonthsExpensesCount = async ({ userId }: { userId: string }) => {
  const startOfMonth = getStartOfMonth()

  const { count: data, error } = await supabase
    .from('expenses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString())

  if (data && !error) {
    return data
  } else if (error) {
    throw new Error(error.message)
  }
  throw new Error('Failed to load expenses')
}

export const fetchExpensesSummary = async ({
  userId,
}: {
  userId: string
}): Promise<ExpensesSummary> => {
  try {
    const [todaysExpenses, weeksExpenses, monthsExpenses, monthsExpensesCount] =
      await Promise.all([
        fetchTodaysExpenses({ userId }),
        fetchWeeksExpenses({ userId }),
        fetchMonthsExpenses({ userId }),
        fetchMonthsExpensesCount({ userId }),
      ])

    return {
      todayTotal:
        todaysExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0,
      weekTotal: weeksExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0,
      monthTotal:
        monthsExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0,
      thisMonthExpensesCount: monthsExpensesCount || 0,
    }
  } catch (e) {
    throw new Error('Failed to retrieve ExpenseSummary')
  }
}

export const fetchExpensesThreeMonthsAgo = async ({
  userId,
}: {
  userId: string
}): Promise<Expense[]> => {
  const threeMonthsAgo = getThreeMonthsAgo()

  const { data, error } = await supabase
    .from('expenses')
    .select(
      `
        id,
        amount,
        description,
        created_at,
        date,
        receipt_url,
        expense_categories (
          id,
          name,
          icon
        )
      `
    )
    .eq('user_id', userId)
    .gte('date', format(threeMonthsAgo, 'yyyy-MM-dd'))
    .order('date')
    .overrideTypes<Expense[]>()

  if (data && !error) {
    return data
  } else if (error) {
    throw new Error(error.message)
  }
  throw new Error('Failed to load expenses')
}
