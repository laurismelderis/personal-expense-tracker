import { AuthProvider } from '@repo/core'
import { Stack } from 'expo-router'

const AppLayout = () => {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </AuthProvider>
  )
}

export default AppLayout
