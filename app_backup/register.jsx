import { Stack } from 'expo-router'
import RegisterScreen from '../src/screens/auth/RegisterScreen'

export default function RegisterPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <RegisterScreen />
    </>
  )
}