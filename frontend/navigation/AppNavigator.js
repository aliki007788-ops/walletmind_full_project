import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppStack from './AppStack';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const f = async () => { const t = await SecureStore.getItemAsync('accessToken'); setIsAuthenticated(!!t); setLoading(false);}; f(); },[]);
  if (loading) return null;
  return <NavigationContainer>{isAuthenticated ? <AppStack /> : <AuthNavigator />}</NavigationContainer>;
}
