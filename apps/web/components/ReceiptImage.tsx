'use client'

import { useState, useEffect } from 'react'
// import { getReceiptSignedUrl } from '@/lib/receipt-utils'

interface ReceiptImageProps {
  receiptPath: string
  alt: string
  className?: string
  onError?: () => void
}

export function ReceiptImage({
  receiptPath,
  alt,
  className,
  onError,
}: ReceiptImageProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // const loadSignedUrl = async () => {
    //   try {
    //     const url = await getReceiptSignedUrl(receiptPath)
    //     if (url) {
    //       setSignedUrl(url)
    //     } else {
    //       setHasError(true)
    //       onError?.()
    //     }
    //   } catch (error) {
    //     console.error('Error loading receipt URL:', error)
    //     setHasError(true)
    //     onError?.()
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }

    if (receiptPath) {
      // loadSignedUrl()
    }
  }, [receiptPath, onError])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (hasError || !signedUrl) {
    return (
      <div className="text-center text-muted-foreground p-8">
        Receipt image could not be loaded
      </div>
    )
  }

  return (
    <img
      src={signedUrl}
      alt={alt}
      className={className}
      onError={() => {
        setHasError(true)
        onError?.()
      }}
    />
  )
}
