import { subMonths } from 'date-fns'

export const getToday = () => {
  const now = new Date()

  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export const getStartOfWeek = () => {
  const today = getToday()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())

  return startOfWeek
}

export const getStartOfMonth = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

export const getThreeMonthsAgo = () => {
  return subMonths(new Date(), 3)
}
