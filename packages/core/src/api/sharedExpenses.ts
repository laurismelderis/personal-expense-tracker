import { supabase } from '../lib/supabase'

export interface SharedExpense {
  id: string
  amount: number
  description: string
  date: string
  receipt_url?: string | null
  category_name: string
  category_icon: string
}

export const fetchAddSharedExpenses = async ({
  reportExpenses,
}: {
  reportExpenses: Array<
    Omit<SharedExpense, 'id'> & {
      report_id: string
      expense_id: string
    }
  >
}) => {
  const { error } = await (supabase as any)
    .from('report_expenses')
    .insert(reportExpenses)

  if (error) {
    throw new Error(error?.message)
  } else if (!error) {
    return
  }
  throw new Error('Failed adding shared expense')
}

export const fetchSharedExpenses = async ({
  reportId,
}: {
  reportId: string
}): Promise<SharedExpense[]> => {
  const { data, error } = await supabase
    .from('report_expenses')
    .select('*')
    .eq('report_id', reportId)
    .order('date', { ascending: false })

  if (!error && data) {
    return data
  } else if (error) {
    throw new Error(error.message)
  }
  throw new Error('Failed to fetch shared expenses')
}
