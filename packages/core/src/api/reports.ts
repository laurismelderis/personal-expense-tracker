import { supabase } from '../lib/supabase'

export interface Report {
  id: string
  user_id: string
  title: string
  description?: string
  start_date?: string
  end_date?: string
  category_filter?: string[]
  total_amount: number
  expense_count: number
  created_at: string
  is_shared: boolean
  view_count: number
  expires_at: string
}

export const fetchReports = async ({
  userId,
}: {
  userId: string
}): Promise<Report[]> => {
  const { data, error } = await supabase
    .from('shared_reports')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (!error && data) {
    return data
  } else if (error) {
    throw new Error(error.message)
  }
  throw new Error('Failed to load reports')
}

export const fetchReport = async ({
  userId,
  reportId,
}: {
  userId: string
  reportId: string
}): Promise<Report> => {
  // Fetch report data
  const { data, error } = await supabase
    .from('shared_reports')
    .select('*')
    .eq('id', reportId)
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (data && !error) {
    return data
  } else if (error) {
    throw new Error(error.message)
  }
  throw new Error('Failed to load report')
}

export const fetchSharedReport = async ({
  hashId,
}: {
  hashId: string
}): Promise<Report> => {
  // Fetch shared report data
  const { data, error } = await supabase
    .from('shared_reports')
    .select('*')
    .eq('hash_id', hashId)
    .eq('is_active', true)
    .single()

  if (data && !error) {
    return data
  } else if (error) {
    throw new Error(error.message)
  }
  throw new Error('Failed to load shared report')
}

export const fetchSetSharedReportViews = async ({
  newViews,
  reportId,
}: {
  newViews: number
  reportId: string
}) => {
  const { error } = await supabase
    .from('shared_reports')
    .update({ view_count: newViews })
    .eq('id', reportId)

  if (error) {
    throw new Error(error.message)
  }
}

export const fetchAddReport = async ({
  userId,
  title,
  description,
  startDate,
  endDate,
  categoryFilter,
  totalAmount,
  expenseCount,
  isShared,
  isActive,
}: {
  userId: string
  title: string
  description: string | null
  startDate: string
  endDate: string
  categoryFilter: string[] | null
  totalAmount: number
  expenseCount: number
  isShared: boolean
  isActive: boolean
}) => {
  const { data, error } = await supabase
    .from('shared_reports')
    .insert({
      user_id: userId,
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      category_filter: categoryFilter,
      total_amount: totalAmount,
      expense_count: expenseCount,
      is_shared: isShared,
      is_active: isActive,
    })
    .select()
    .single()

  if (data && !error) {
    return data
  } else if (error) {
    throw new Error(error.message)
  }
  throw new Error('Failed to add report')
}

export const fetchRemoveReport = async ({
  userId,
  reportId,
}: {
  userId: string
  reportId: string
}) => {
  const { error } = await supabase
    .from('shared_reports')
    .update({ is_active: false })
    .eq('id', reportId)
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }
}

export const fetchShareReport = async ({
  userId,
  reportId,
}: {
  userId: string
  reportId: string
}) => {
  const shareHash = Math.random().toString(36).substring(2, 15)

  const { error } = await supabase
    .from('shared_reports')
    .update({
      hash_id: shareHash,
      is_shared: true,
    })
    .eq('id', reportId)
    .eq('user_id', userId)

  if (error) {
    throw new Error(error.message)
  }

  return shareHash
}
