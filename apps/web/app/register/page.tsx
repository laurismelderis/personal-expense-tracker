'use client'

import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { AuthContext, AuthContextType, Button } from '@repo/core'

import styles from '../../styles/index.module.css'
import { useRouter } from 'next/navigation'
import { ROUTES } from '../../constants/routes'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('lauris.melderis77@gmail.com')
  const [password, setPassword] = useState('12345678')
  const [error, setError] = useState<string | null>(null)
  const { signUp, user } = useContext(AuthContext) as AuthContextType

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target?.value)
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target?.value)
  const handleRegister = async () => {
    try {
      await signUp(email, password)
      setError(null)
    } catch (e: unknown) {
      setError((e as Error).message)
    }
  }

  useEffect(() => {
    if (user) {
      router.push(ROUTES.DASHBOARD)
    }
  }, [user])

  return (
    <div className={styles.container}>
      <h1>Register</h1>
      <div>
        <label>Email</label>
        <input
          value={email}
          onChange={handleEmailChange}
          type="text"
          placeholder="Email"
        />
      </div>
      <div>
        <label>Password</label>
        <input
          value={password}
          onChange={handlePasswordChange}
          type="password"
          placeholder="Password"
        />
      </div>
      {error ? <p>{error}</p> : null}
      <Button onClick={handleRegister} text="Register" />
    </div>
  )
}
