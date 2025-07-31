import { AuthProvider } from '@repo/core'
import './global.css'
import { Toaster } from '../components/common/Toaster'
import { TooltipProvider } from '../components/common/Tooltip'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
