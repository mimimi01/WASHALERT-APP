import React from 'react'
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native'
import { useAuth } from '../src/context/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'

export default function SplashScreen() {
  const { loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logosContainer}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>
          Wash<Text style={styles.titleAccent}>Alert</Text>
        </Text>

        <Text style={styles.subtitle}>
          Premium Laundry Management System
        </Text>

        <ActivityIndicator size="large" color="#2563eb" style={styles.loader} />
      </View>

      <Text style={styles.footer}>
        © 2025 Triplets LaundryHubs & SpeedyWash
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
  },
  logosContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: -0.5,
  },
  titleAccent: {
    color: '#2563eb',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  loader: {
    marginTop: 32,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
})