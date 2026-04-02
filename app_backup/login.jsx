import { Stack } from 'expo-router'
import LoginScreen from '../src/screens/auth/LoginScreen'

export default function LoginPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LoginScreen />
    </>
  )
}