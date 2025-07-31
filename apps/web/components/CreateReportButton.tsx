'use client'

import { FileText } from 'lucide-react'
import { Button } from './common/Button'
import { ROUTES } from '../constants/routes'

interface CreateReportButtonProps {
  className?: string
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
}

export function CreateReportButton({
  className,
  variant = 'ghost',
}: CreateReportButtonProps) {
  return (
    <a href={ROUTES.REPORTS_CREATE}>
      <Button variant={variant} className={`w-full justify-start ${className}`}>
        <FileText className="mr-2 h-4 w-4" />
        Create Report
      </Button>
    </a>
  )
}
