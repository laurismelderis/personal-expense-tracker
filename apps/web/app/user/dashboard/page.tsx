'use client'

import styles from '../../../styles/index.module.css'
import { AuthContext, AuthContextType, Button } from '@repo/core'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

export default function UserPage() {
  const router = useRouter()
  const { signOut } = useContext(AuthContext) as AuthContextType

  const handleLogout = () => {
    signOut()
    router.push('/')
  }

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      <Button text="Log out" onClick={handleLogout} />
    </div>
  )
}
