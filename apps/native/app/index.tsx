import { DollarSign, PieChart, TrendingUp } from 'lucide-react-native'
import React, { useContext, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import IconText from './(components)/IconText'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './(components)/common/Card'
import { Input } from './(components)/common/Input'
import Button from './(components)/common/Button'
import Label from './(components)/common/Label'
import { AuthContext, AuthContextType } from '@repo/core'

export const colors = {
  background: '#ffffff',
  inputBorder: '#d1d5db',
  text: '#111827',
  mutedForeground: '#6b7280',
  ring: '#3b82f6',
  disabledBg: '#f9fafb',
  disabledText: '#9ca3af',
}

const App = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const { signIn, signUp, user, loading } = useContext(
    AuthContext
  ) as AuthContextType

  const handleLogin = async () => {}
  const handleRegister = async () => {}

  const handleSubmit = () => {}

  return (
    <View style={styles.appContainer}>
      <Text style={styles.title}>Take control of Your Finances</Text>
      <View style={styles.iconContainer}>
        <IconText icon={<TrendingUp color={styles.icon.color} />}>
          Track Expenses
        </IconText>
        <IconText icon={<PieChart color={styles.icon.color} />}>
          View Analytics
        </IconText>
        <IconText icon={<DollarSign color={styles.icon.color} />}>
          Save Money
        </IconText>
      </View>
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one to get started
          </CardDescription>
        </CardHeader>
        <CardContent style={{ gap: 16 }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Button
              style={{ width: '40%' }}
              disabled={activeTab === 'signin'}
              variant="outline"
              onPress={() => setActiveTab('signin')}
            >
              Sign in
            </Button>
            <Button
              style={{ width: '40%' }}
              disabled={activeTab === 'signup'}
              variant="outline"
              onPress={() => setActiveTab('signup')}
            >
              Sign up
            </Button>
          </View>
          <View>
            <Label>Email</Label>
            <Input
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View>
            <Label>Password</Label>
            <Input
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </CardContent>
        <CardFooter>
          <Button style={{ width: '100%' }} onPress={handleSubmit}>
            {activeTab === 'signin' ? 'Sign in' : 'Create Account'}
          </Button>
        </CardFooter>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  appContainer: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingInline: 32,
    gap: 16,
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingInline: 16,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EFEFEF',
    textAlign: 'center',
  },
  icon: {
    color: '#16a249',
  },
})

export default App
