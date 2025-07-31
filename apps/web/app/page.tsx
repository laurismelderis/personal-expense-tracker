import Link from 'next/link'
import { ROUTES } from '../constants/routes'

export default function HomePage() {
  return (
    <div>
      <h1>Expense tracker app</h1>
      <div>
        <Link href={ROUTES.LOGIN}>Log in</Link>
        <Link href={ROUTES.REGISTER}>Register</Link>
      </div>
    </div>
  )
}
