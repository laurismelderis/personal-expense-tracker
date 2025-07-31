import ProtectedRoute from '../../components/ProtectedRoute'

// export const getServerSideProps = async () => {}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
