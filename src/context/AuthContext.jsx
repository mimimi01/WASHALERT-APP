import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(undefined);

// Demo users for testing
const DEMO_USERS = [
  { id: '1', fullName: 'Juan Dela Cruz', email: 'customer@washalert.ph', phone: '09171234567', role: 'customer' },
  { id: '2', fullName: 'Maria Santos', email: 'driver@washalert.ph', phone: '09181234567', role: 'driver' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      // Ensure splash screen shows for at least 2 seconds
      const minDelay = new Promise((r) => setTimeout(r, 2000));
      
      // TEMPORARILY DISABLED FOR FLOW TESTING:
      // const userData = await AsyncStorage.getItem('userData');
      
      await minDelay;
      
      // if (userData) {
      //   setUser(JSON.parse(userData));
      // }
    } catch (e) {
      console.error('Failed to restore user:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return { success: false, error: 'Invalid email format' };
    }
    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    const found = DEMO_USERS.find((u) => u.email === email);
    if (found) {
      await AsyncStorage.setItem('userData', JSON.stringify(found));
      setUser(found);
    } else {
      // Default to customer for any login
      const newUser = { id: '99', fullName: 'New User', email, phone: '', role: 'customer' };
      await AsyncStorage.setItem('userData', JSON.stringify(newUser));
      setUser(newUser);
    }
    setIsLoading(false);
    return { success: true };
  }, []);

  const register = useCallback(async (data) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const newUser = { id: '99', fullName: data.fullName, email: data.email, phone: data.phone, role: 'customer' };
    await AsyncStorage.setItem('userData', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
    return { success: true };
  }, []);

  const signup = register;

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userToken');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const forgotPassword = useCallback(async (email) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    return { success: true };
  }, []);

  const verifyOTP = useCallback(async (code) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    return { success: true };
  }, []);

  const resetPassword = useCallback(async (password) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loading: isLoading,
        login,
        register,
        signup,
        logout,
        forgotPassword,
        verifyOTP,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};