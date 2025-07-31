import { supabase } from '../lib/supabase'

export interface Category {
  id: string
  name: string
  icon: string
}

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('expense_categories')
    .select('*')
    .order('name')
    .overrideTypes<Category[]>()

  if (!error && data) {
    return data
  } else if (error) {
    throw new Error(error.message)
  }
  throw new Error('Something went wrong')
}
