import Link from 'next/link'
import styles from '../styles/index.module.css'
import { ROUTES } from '../constants/routes'

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1>Expense tracker app</h1>
      <div>
        <Link href={ROUTES.LOGIN}>Log in</Link>
        <Link href={ROUTES.REGISTER}>Register</Link>
      </div>
    </div>
  )
}
