'use client'

import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { AuthContext, AuthContextType } from '@repo/core'

import { useRouter } from 'next/navigation'
import { ROUTES } from '../../constants/routes'
import { DollarSign, TrendingUp, PieChart } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/common/Card'
import { Label } from '../../components/common/Label'
import { Input } from '../../components/common/Input'
import { Button } from '../../components/common/Button'
import { useToast } from '../../hooks/useToast'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/common/Tabs'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('lauris.melderis77@gmail.com')
  const [password, setPassword] = useState<string>('')
  const { toast } = useToast()
  const { signIn, signUp, user, loading } = useContext(
    AuthContext
  ) as AuthContextType

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target?.value)
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target?.value)
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!email || !password) throw new Error('Missing email or password')

      await signIn(email, password)
      router.push('/user/dashboard')
    } catch (e) {
      const message = (e as Error).message
      toast({
        title: 'Sign in failed',
        description: message,
        variant: 'destructive',
      })
    }
  }
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!email || !password) throw new Error('Missing email or password')

      await signUp(email, password)
      router.push('/user/dashboard')
    } catch (e: unknown) {
      const message = (e as Error).message
      toast({
        title: 'Registration failed',
        description: message,
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    if (user) {
      router.push(ROUTES.DASHBOARD)
    }
  }, [user])

  return (
    <div className="min-h-screen bg-background flex flex-col ">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">ExpenseTracker</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Feature highlights */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">
              Take Control of Your Finances
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <TrendingUp className="h-8 w-8 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Track Expenses</p>
              </div>
              <div className="space-y-2">
                <PieChart className="h-8 w-8 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">View Analytics</p>
              </div>
              <div className="space-y-2">
                <DollarSign className="h-8 w-8 mx-auto text-primary" />
                <p className="text-sm text-muted-foreground">Save Money</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Welcome</CardTitle>
              <CardDescription>
                Sign in to your account or create a new one to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="your@email.com"
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        disabled={loading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
